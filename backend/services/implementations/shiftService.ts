import moment, { Moment, DurationInputArg1, DurationInputArg2 } from "moment";
import { PrismaClient, Shift } from "@prisma/client";
import IShiftService from "../interfaces/IShiftService";
import {
  RecurrenceInterval,
  ShiftBulkRequestDTO,
  ShiftRequestDTO,
  ShiftResponseDTO,
  TimeBlock,
  TimeBlockDTO,
} from "../../types";
import logger from "../../utilities/logger";

const prisma = new PrismaClient();

const Logger = logger(__filename);

type DurationArgs = {
  value: DurationInputArg1;
  unit: DurationInputArg2;
};

const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm";
const dateTimeFormat = "YYYY-MM-DD HH:mm";
const STRICT_MODE = true;

class ShiftService implements IShiftService {
  /* eslint-disable class-methods-use-this */
  getDuration(recurrence: RecurrenceInterval): DurationArgs | null {
    switch (recurrence) {
      case "NONE": // No recurrence
        return null;
      case "WEEKLY": // Weekly
        return { unit: "week", value: 1 };
      case "BIWEEKLY": // Biweekly
        return { unit: "week", value: 2 };
      case "MONTHLY": // Monthly
        return { unit: "week", value: 4 };
      default:
        throw new Error(`Invalid recurrence ${recurrence}`);
    }
  }

  validateShift(shift: ShiftRequestDTO): [boolean, string] {
    const startTime = moment(shift.startTime, dateTimeFormat, STRICT_MODE);
    const endTime = moment(shift.endTime, dateTimeFormat, STRICT_MODE);
    // Check that startTime and endTime are valid
    if (!startTime.isValid() || !endTime.isValid()) {
      return [false, "Invalid startTime or endTime"];
    }
    // Check that endTime is after startTime
    if (endTime.isBefore(startTime)) {
      return [false, "endTime must be after startTime"];
    }
    // Check that startTime and endTime are in the same day
    if (startTime.format(dateFormat) !== endTime.format(dateFormat)) {
      return [false, "startTime and endTime must be in the same day"];
    }
    return [true, ""];
  }

  validateTimeBlocks(timeBlocks: TimeBlockDTO[]): [boolean, string] {
    if (timeBlocks.length === 0) return [false, "No time blocks provided"];
    // Check that start time is before end time
    if (
      timeBlocks.some(
        (tb) =>
          !tb.date ||
          !tb.startTime ||
          !tb.endTime ||
          !moment(
            `${tb.date} ${tb.startTime}`,
            dateTimeFormat,
            true,
          ).isValid() ||
          !moment(
            `${tb.date} ${tb.endTime}`,
            dateTimeFormat,
            STRICT_MODE,
          ).isValid() ||
          moment(tb.startTime, timeFormat) >= moment(tb.endTime, timeFormat),
      )
    )
      return [false, "Invalid time blocks"];

    const [earliestDate, latestDate] = timeBlocks.reduce(
      (earliestLatestSoFar, currentTimeblock) => {
        const earliestLatestTuple = earliestLatestSoFar;
        const currentDate = moment(
          currentTimeblock.date,
          dateFormat,
          STRICT_MODE,
        );
        earliestLatestTuple[0] = currentDate.isBefore(earliestLatestSoFar[0])
          ? currentDate
          : earliestLatestSoFar[0];
        earliestLatestTuple[1] = currentDate.isAfter(earliestLatestSoFar[1])
          ? currentDate
          : earliestLatestSoFar[1];
        return earliestLatestTuple;
      },
      [
        moment(timeBlocks[0].date, dateFormat, STRICT_MODE),
        moment(timeBlocks[0].date, dateFormat, STRICT_MODE),
      ],
    );

    if (moment.duration(latestDate.diff(earliestDate)).asDays() >= 7)
      return [false, "Time blocks must be within a week"];

    return [true, ""];
  }

  buildTimeBlocks(shifts: ShiftBulkRequestDTO): TimeBlock[] {
    const endDate: Moment = moment(shifts.endDate, dateFormat, STRICT_MODE).add(
      1,
      "day",
    );

    // Get moment's duration function args using recurrence
    const duration: DurationArgs | null = this.getDuration(
      shifts.recurrenceInterval,
    );

    const shiftTimes: TimeBlock[] = shifts.times.flatMap((time) => {
      const startTime = moment(
        `${time.date} ${time.startTime}`,
        dateTimeFormat,
        true,
      );
      const endTime = moment(
        `${time.date} ${time.endTime}`,
        dateTimeFormat,
        true,
      );
      const recurringShifts = [];
      let end = endTime;
      if (duration) {
        for (
          let start = startTime.clone();
          start < endDate;
          start.add(duration.value, duration.unit)
        ) {
          recurringShifts.push({
            startTime: start.toDate(),
            endTime: end.toDate(),
          });
          end = end.add(duration.value, duration.unit);
        }
      } else {
        recurringShifts.push({
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
        });
      }
      return recurringShifts;
    });
    return shiftTimes;
  }

  async getShift(shiftId: string): Promise<ShiftResponseDTO> {
    let shift: Shift | null;

    try {
      shift = await prisma.shift.findUnique({
        where: {
          id: Number(shiftId),
        },
      });

      if (!shift) {
        throw new Error(`shiftId ${shiftId} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get shift. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(shift.id),
      postingId: String(shift.postingId),
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
  }

  async getShifts(): Promise<ShiftResponseDTO[]> {
    try {
      const shifts: Array<Shift> = await prisma.shift.findMany();
      return shifts.map((shift) => ({
        id: String(shift.id),
        postingId: String(shift.postingId),
        startTime: shift.startTime,
        endTime: shift.endTime,
      }));
    } catch (error) {
      Logger.error(`Failed to get shifts. Reason = ${error.message}`);
      throw error;
    }
  }

  async createShift(
    shift: ShiftRequestDTO,
    postingId: number,
  ): Promise<ShiftResponseDTO> {
    const [valid, errorMessage] = this.validateShift(shift);
    if (!valid) throw new Error(errorMessage);

    return prisma.$transaction(async (prismaClient) => {
      const shifts = await prismaClient.shift.findMany({
        where: { postingId },
      });
      for (let i = 0; i < shifts.length; i += 1) {
        if (
          moment(shifts[i].startTime).isSame(shift.startTime, "minute") &&
          moment(shifts[i].endTime).isSame(shift.endTime, "minute")
        ) {
          throw new Error(
            `Shift already exists with start time ${shifts[i].startTime} and end time ${shifts[i].endTime}`,
          );
        }
      }
      const newShift = await prismaClient.shift.create({
        data: {
          postingId,
          startTime: shift.startTime,
          endTime: shift.endTime,
        },
      });
      return {
        id: String(newShift.id),
        postingId: String(newShift.postingId),
        startTime: newShift.startTime,
        endTime: newShift.endTime,
      };
    });
  }

  async createShifts(shifts: ShiftBulkRequestDTO): Promise<ShiftResponseDTO[]> {
    try {
      // Check that input times are valid
      const [valid, errorMessage] = this.validateTimeBlocks(shifts.times);
      if (!valid) throw new Error(errorMessage);

      // Build shiftTimes object
      const shiftTimes: TimeBlock[] = this.buildTimeBlocks(shifts);

      const newShifts = await Promise.all(
        shiftTimes.map(async (shiftTime: TimeBlock) => {
          try {
            const newShift = await this.createShift(
              {
                startTime: shiftTime.startTime,
                endTime: shiftTime.endTime,
              },
              Number(shifts.postingId),
            );
            return newShift;
          } catch (error) {
            Logger.warn(error.message);
            return null;
          }
        }),
      );
      return newShifts.filter((shift) => shift !== null) as ShiftResponseDTO[];
    } catch (error) {
      Logger.error(`Failed to create shift. Reason = ${error.message}`);
      throw error;
    }
  }

  async updateShift(
    shiftId: string,
    shift: ShiftRequestDTO,
  ): Promise<ShiftResponseDTO | null> {
    let updateResult: Shift | null;
    try {
      const [valid, errorMessage] = this.validateShift(shift);
      if (!valid) throw new Error(errorMessage);

      const startTime = moment(shift.startTime, dateTimeFormat, STRICT_MODE);
      const endTime = moment(shift.endTime, dateTimeFormat, STRICT_MODE);

      updateResult = await prisma.shift.update({
        where: { id: Number(shiftId) },
        data: {
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
        },
      });
    } catch (error) {
      Logger.error(`Failed to update shift. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(updateResult.id),
      postingId: String(updateResult.postingId),
      startTime: updateResult.startTime,
      endTime: updateResult.endTime,
    };
  }

  async updateShifts(
    postingId: string,
    shifts: ShiftBulkRequestDTO,
  ): Promise<ShiftResponseDTO[] | null> {
    const [valid, errorMessage] = this.validateTimeBlocks(shifts.times);
    if (!valid) throw new Error(errorMessage);

    const shiftTimes: TimeBlock[] = this.buildTimeBlocks(shifts);

    return prisma.$transaction(async (prismaClient) => {
      await prismaClient.shift.deleteMany({
        where: { postingId: Number(postingId) },
      });

      const newShifts = await Promise.all(
        shiftTimes.map(async (shiftTime: TimeBlock) => {
          try {
            const newShift = await prismaClient.shift.create({
              data: {
                postingId: Number(postingId),
                startTime: shiftTime.startTime,
                endTime: shiftTime.endTime,
              },
            });
            return newShift;
          } catch (error) {
            Logger.warn(error.message);
            return null;
          }
        }),
      );

      return (newShifts.filter((shift) => shift !== null) as Shift[]).map(
        (shift) => ({
          id: String(shift.id),
          postingId: String(shift.postingId),
          startTime: shift.startTime,
          endTime: shift.endTime,
        }),
      );
    });
  }

  async deleteShift(shiftId: string): Promise<string> {
    try {
      await prisma.shift.delete({
        where: { id: Number(shiftId) },
      });
      return shiftId;
    } catch (error) {
      Logger.error(`Failed to delete shift. Reason = ${error.message}`);
      throw error;
    }
  }

  async deleteShifts(postingId: string): Promise<string> {
    try {
      await prisma.shift.deleteMany({
        where: { postingId: Number(postingId) },
      });
      return postingId;
    } catch (error) {
      Logger.error(`Failed to delete shift. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default ShiftService;

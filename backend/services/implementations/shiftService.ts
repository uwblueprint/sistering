import { Prisma, PrismaClient, Shift } from "@prisma/client";
import { Promise as BluebirdPromise } from "bluebird";
import moment, { Moment, DurationInputArg1, DurationInputArg2 } from "moment";

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
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

type DurationArgs = {
  value: DurationInputArg1;
  unit: DurationInputArg2;
};

type PrismaTransactionClient = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

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
            STRICT_MODE,
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
        STRICT_MODE,
      );
      const endTime = moment(
        `${time.date} ${time.endTime}`,
        dateTimeFormat,
        STRICT_MODE,
      );
      const recurringShifts = [];
      if (duration) {
        for (
          let start = startTime.clone(), end = endTime;
          start < endDate;
          start.add(duration.value, duration.unit),
            end.add(duration.value, duration.unit)
        ) {
          recurringShifts.push({
            startTime: start.toDate(),
            endTime: end.toDate(),
          });
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

  async checkConflictingShifts(
    prismaClient: PrismaTransactionClient,
    shiftTime: TimeBlock,
    postingId: string,
  ): Promise<void> {
    const shifts = await prismaClient.shift.findMany({
      where: { postingId: Number(postingId) },
    });

    shifts.forEach((shift) => {
      if (
        moment(shift.startTime).isSame(shiftTime.startTime, "minute") &&
        moment(shift.endTime).isSame(shiftTime.endTime, "minute")
      ) {
        throw new Error(
          `Shift already exists with start time ${shift.startTime} and end time ${shift.endTime}`,
        );
      }
    });
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
      Logger.error(`Failed to get shift. Reason = ${getErrorMessage(error)}`);
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
      Logger.error(`Failed to get shifts. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createShift(
    shift: TimeBlock,
    postingId: string,
  ): Promise<ShiftResponseDTO> {
    const [valid, errorMessage] = this.validateShift(shift);
    if (!valid) throw new Error(errorMessage);

    return prisma.$transaction(async (prismaClient) => {
      await this.checkConflictingShifts(prismaClient, shift, postingId);

      const newShift = await prismaClient.shift.create({
        data: {
          postingId: Number(postingId),
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

      const newShifts = await BluebirdPromise.mapSeries(
        shiftTimes,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        async (shiftTime: TimeBlock, _index: number, _arrayLength: number) => {
          try {
            const newShift = await this.createShift(
              {
                startTime: shiftTime.startTime,
                endTime: shiftTime.endTime,
              },
              shifts.postingId,
            );
            return newShift;
          } catch (error) {
            Logger.warn(error.message);
            return null;
          }
        },
      );
      return newShifts.filter((shift) => shift !== null) as ShiftResponseDTO[];
    } catch (error) {
      Logger.error(
        `Failed to create shift. Reason = ${getErrorMessage(error)}`,
      );
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
      Logger.error(
        `Failed to update shift. Reason = ${getErrorMessage(error)}`,
      );
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

      const newShifts = await BluebirdPromise.mapSeries(
        shiftTimes,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        async (shiftTime: TimeBlock, _index: number, _arrayLength: number) => {
          try {
            await this.checkConflictingShifts(
              prismaClient,
              shiftTime,
              postingId,
            );

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
        },
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
      Logger.error(
        `Failed to delete shift. Reason = ${getErrorMessage(error)}`,
      );
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
      Logger.error(
        `Failed to delete shift. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ShiftService;

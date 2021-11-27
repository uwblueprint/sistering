import moment, { Moment } from "moment";
import { PrismaClient, Shift } from "@prisma/client";
import IShiftService, { DurationArgs } from "../interfaces/IShiftService";
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

class ShiftService implements IShiftService {
  /* eslint-disable class-methods-use-this */
  getDuration(recurrence: RecurrenceInterval): DurationArgs {
    switch (recurrence) {
      case "NONE": // No recurrence
        return { unit: "day", value: 1 };
      case "WEEKLY": // Weekly
        return { unit: "week", value: 1 };
      case "BIWEEKLY": // Biweekly
        return { unit: "week", value: 2 };
      default:
        // Monthly
        return { unit: "month", value: 1 };
    }
  }

  validateTimeBlocks(timeBlocks: TimeBlockDTO[]): boolean {
    if (timeBlocks.length === 0) return false;
    // Check that start time is before end time
    if (
      timeBlocks.every(
        (tb) =>
          !tb.date ||
          !tb.startTime ||
          !tb.endTime ||
          !moment(
            `${tb.date} ${tb.startTime}`,
            "YYYY-MM-DD HH:mm",
            true,
          ).isValid() ||
          !moment(
            `${tb.date} ${tb.endTime}`,
            "YYYY-MM-DD HH:mm",
            true,
          ).isValid() ||
          moment(tb.startTime, "HH:mm") >= moment(tb.endTime, "HH:mm"),
      )
    )
      return false;

    // Check that start dates are within the range of 1 week
    let earliestDate = moment(timeBlocks[0].date, "YYYY-MM-DD", true);
    let latestDate = moment(timeBlocks[0].date, "YYYY-MM-DD", true);

    if (!earliestDate.isValid() || !latestDate.isValid()) {
      return false;
    }

    timeBlocks.forEach((tb) => {
      if (moment(tb.date, "YYYY-MM-DD", true).isBefore(earliestDate))
        earliestDate = moment(tb.date, "YYYY-MM-DD", true);
      if (moment(tb.date, "YYYY-MM-DD", true).isAfter(latestDate))
        latestDate = moment(tb.date, "YYYY-MM-DD", true);
    });

    if (moment.duration(latestDate.diff(earliestDate)).asDays() >= 7)
      return false;

    return true;
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
    return prisma.$transaction(async (prismaClient) => {
      const shifts = await prismaClient.shift.findMany();
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
    const newShifts: ShiftResponseDTO[] = [];

    try {
      const shiftTimes: TimeBlock[] = [];
      const startTimes: Moment[] = shifts.times.map((time) =>
        moment(`${time.date} ${time.startTime}`, "YYYY-MM-DD HH:mm", true),
      );
      const endTimes: Moment[] = shifts.times.map((time) =>
        moment(`${time.date} ${time.endTime}`, "YYYY-MM-DD HH:mm", true),
      );
      const endDate: Moment = moment(shifts.endDate, "YYYY-MM-DD", true).add(
        1,
        "day",
      );

      // Get moment's duration function args using recurrence
      const duration: DurationArgs = this.getDuration(
        shifts.recurrenceInterval,
      );

      // Check that input times are valid
      if (!this.validateTimeBlocks(shifts.times))
        throw new Error("Invalid time blocks");

      // Validate postingId
      const posting = await prisma.posting.findUnique({
        where: {
          id: Number(shifts.postingId),
        },
      });
      if (!posting) {
        throw new Error(`Posting ${shifts.postingId} not found.`);
      }

      // Build shiftTimes object
      for (let i = 0; i < startTimes.length; i += 1) {
        let end = endTimes[i];
        for (
          let start = startTimes[i].clone();
          start < endDate;
          start.add(duration.value, duration.unit)
        ) {
          shiftTimes.push({
            startTime: start.toDate(),
            endTime: end.toDate(),
          });
          end = end.add(duration.value, duration.unit);
        }
      }

      await Promise.all(
        shiftTimes.map(async (shiftTime: TimeBlock) => {
          try {
            const newShift = await this.createShift(
              {
                startTime: shiftTime.startTime,
                endTime: shiftTime.endTime,
              },
              Number(shifts.postingId),
            );
            newShifts.push(newShift);
          } catch (error) {
            Logger.warn(error.message);
          }
        }),
      );
      return newShifts;
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
      const startTime = moment(shift.startTime, "YYYY-MM-DD HH:mm", true);
      const endTime = moment(shift.endTime, "YYYY-MM-DD HH:mm", true);
      // Check that startTime and endTime are valid
      if (!startTime.isValid() || !endTime.isValid()) {
        throw new Error("Invalid startTime or endTime");
      }
      // Check that endTime is after startTime
      if (endTime.isBefore(startTime)) {
        throw new Error(
          `Start time ${shift.startTime} is after end time ${shift.endTime}`,
        );
      }
      // Check that startTime and endTime are in the same day
      if (startTime.format("YYYY-MM-DD") !== endTime.format("YYYY-MM-DD")) {
        throw new Error(
          `Start time ${shift.startTime} and end time ${shift.endTime} are not in the same day`,
        );
      }
      await prisma.shift.findUnique({
        where: {
          id: Number(shiftId),
        },
      });
      updateResult = await prisma.shift.update({
        where: { id: Number(shiftId) },
        data: {
          startTime: startTime.toDate(),
          endTime: endTime.toDate(),
        },
      });

      if (!updateResult) {
        throw new Error(`Shift id ${shiftId} not found`);
      }
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
    // Validate postingId
    const posting = await prisma.posting.findUnique({
      where: {
        id: Number(shifts.postingId),
      },
    });
    if (!posting) {
      throw new Error(`Posting ${shifts.postingId} not found.`);
    }

    if (!this.validateTimeBlocks(shifts.times))
      throw new Error("Invalid time blocks");

    await this.deleteShifts(postingId);
    const newShifts: ShiftResponseDTO[] = await this.createShifts(shifts);

    return newShifts;
  }

  async deleteShift(shiftId: string): Promise<void> {
    try {
      const shiftToDelete = await prisma.shift.findUnique({
        where: { id: Number(shiftId) },
      });
      const deleteResult: Shift | null = await prisma.shift.delete({
        where: { id: Number(shiftId) },
      });

      if (!shiftToDelete || !deleteResult) {
        throw new Error(`Shift id ${shiftId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete shift. Reason = ${error.message}`);
      throw error;
    }
  }

  async deleteShifts(postingId: string): Promise<void> {
    try {
      // Validate postingId
      const posting = await prisma.posting.findUnique({
        where: {
          id: Number(postingId),
        },
      });
      if (!posting) {
        throw new Error(`Posting ${postingId} not found.`);
      }

      const shiftToDelete = await prisma.shift.findMany({
        where: { postingId: Number(postingId) },
      });
      const deleteResultCount = await prisma.shift.deleteMany({
        where: { postingId: Number(postingId) },
      });

      if (!shiftToDelete || !deleteResultCount) {
        throw new Error(`Shift with posting id ${postingId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete shift. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default ShiftService;

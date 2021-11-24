import moment, { Moment } from "moment";
import { PrismaClient, Shift } from "@prisma/client";
import IShiftService, { DurationArgs } from "../interfaces/IShiftService";
import {
  BulkShiftRequestDTO,
  RecurrenceInterval,
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
      case "NONE":
        return { unit: "day", value: 1 };
      case "WEEKLY":
        return { unit: "week", value: 1 };
      case "BIWEEKLY":
        return { unit: "week", value: 2 };
      case "MONTHLY":
        return { unit: "month", value: 1 };
      default:
        return { unit: "day", value: -1 };
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
          moment(tb.startTime, "HH:mm") >= moment(tb.endTime, "HH:mm"),
      )
    )
      return false;

    // Check that start dates are within the range of 1 week
    let earliestDate = moment(timeBlocks[0].date, "YYYY-MM-DD");
    let latestDate = moment(timeBlocks[0].date, "YYYY-MM-DD");
    timeBlocks.forEach((tb) => {
      if (moment(tb.date, "YYYY-MM-DD").isBefore(earliestDate))
        earliestDate = moment(tb.date, "YYYY-MM-DD");
      if (moment(tb.date, "YYYY-MM-DD").isAfter(latestDate))
        latestDate = moment(tb.date, "YYYY-MM-DD");
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

  async createShifts(shifts: BulkShiftRequestDTO): Promise<ShiftResponseDTO[]> {
    const newShifts: Shift[] = [];

    try {
      const shiftTimes: TimeBlock[] = [];
      const startTimes: Moment[] = shifts.times.map((time) =>
        moment(`${time.date} ${time.startTime}`, "YYYY-MM-DD HH:mm"),
      );
      const endTimes: Moment[] = shifts.times.map((time) =>
        moment(`${time.date} ${time.endTime}`, "YYYY-MM-DD HH:mm"),
      );
      const endDate: Moment = moment(shifts.endDate, "YYYY-MM-DD").add(
        1,
        "day",
      );

      const duration: DurationArgs = this.getDuration(
        shifts.recurrenceInterval,
      );
      if (duration.value === -1) throw new Error("Invalid recurrence interval");

      if (!this.validateTimeBlocks(shifts.times))
        throw new Error("Invalid time blocks");

      // TODO: Check that postingId is valid

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

      console.log(shiftTimes);

      await Promise.all(
        shiftTimes.map(async (shiftTime: TimeBlock) => {
          const newShift = await prisma.shift.create({
            data: {
              postingId: Number(shifts.postingId),
              startTime: shiftTime.startTime,
              endTime: shiftTime.endTime,
            },
          });
          newShifts.push(newShift);
        }),
      );

      return newShifts.map((shift) => ({
        id: String(shift.id),
        postingId: String(shift.postingId),
        startTime: shift.startTime,
        endTime: shift.endTime,
      }));
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
      if (moment(shift.startTime).isAfter(shift.endTime)) {
        throw new Error(
          `Failed to update shift. Reason = Start time ${shift.startTime} is after end time ${shift.endTime}`,
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
          startTime: shift.startTime,
          endTime: shift.endTime,
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
    shifts: BulkShiftRequestDTO,
  ): Promise<ShiftResponseDTO[] | null> {
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

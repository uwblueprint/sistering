import {
  Prisma,
  PrismaClient,
  Shift,
  Signup,
  SignupStatus,
  User,
  Volunteer,
} from "@prisma/client";
import { Promise as BluebirdPromise } from "bluebird";

import moment from "moment";
import IShiftService from "../interfaces/shiftService";
import {
  ShiftBulkRequestDTO,
  ShiftBulkRequestWithoutPostingId,
  ShiftRequestDTO,
  ShiftResponseDTO,
  ShiftWithSignupAndVolunteerResponseDTO,
  SignupsAndVolunteerResponseDTO,
  TimeBlock,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import { getInterval } from "../../utilities/dateUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

type PrismaTransactionClient = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

const WEEK_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

type SignupWithVolunteers = Signup & {
  user: User & {
    volunteer: Volunteer | null;
  };
};

type ShiftWithSignupAndVolunteers = Shift & {
  signups: SignupWithVolunteers[];
};

class ShiftService implements IShiftService {
  /* eslint-disable class-methods-use-this */

  getTimeBlocksOnAfterEarliestDate(
    timeBlocks: TimeBlock[],
    earliestDate: Date,
  ): TimeBlock[] {
    return timeBlocks.filter((shift) =>
      moment(shift.startTime).isSameOrAfter(earliestDate),
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  }

  isSameDateTime(date1: Date, date2: Date): boolean {
    return (
      this.isSameDate(date1, date2) &&
      date1.getUTCHours() === date2.getUTCHours() &&
      date1.getUTCMinutes() === date2.getUTCMinutes()
    );
  }

  validateShift(shift: ShiftRequestDTO): [boolean, string] {
    // Check that endTime is after startTime
    if (shift.startTime.getTime() >= shift.endTime.getTime()) {
      return [false, "endTime must be after startTime"];
    }
    // Check that startTime and endTime are in the same day
    if (!this.isSameDate(shift.startTime, shift.endTime)) {
      return [false, "startTime and endTime must be in the same day"];
    }
    return [true, ""];
  }

  validateTimeBlocks(timeBlocks: TimeBlock[]): [boolean, string] {
    if (timeBlocks.length === 0) return [false, "No time blocks provided"];
    // Check that start time is before end time
    if (
      timeBlocks.some((timeBlock) => this.validateShift(timeBlock)[0] === false)
    )
      return [false, "Invalid time blocks"];

    const [earliestDate, latestDate] = timeBlocks.reduce(
      (earliestLatestSoFar, currentTimeBlock) => {
        const earliestLatestTuple = earliestLatestSoFar;
        earliestLatestTuple[0] =
          currentTimeBlock.startTime.getTime() <
          earliestLatestSoFar[0].getTime()
            ? currentTimeBlock.startTime
            : earliestLatestSoFar[0];
        earliestLatestTuple[1] =
          currentTimeBlock.endTime.getTime() > earliestLatestSoFar[1].getTime()
            ? currentTimeBlock.endTime
            : earliestLatestSoFar[1];
        return earliestLatestTuple;
      },
      [timeBlocks[0].startTime, timeBlocks[0].endTime],
    );

    if (latestDate.getTime() - earliestDate.getTime() > WEEK_IN_MILLISECONDS)
      return [false, "Time blocks must be within a week"];

    return [true, ""];
  }

  buildTimeBlocks(shifts: ShiftBulkRequestWithoutPostingId): TimeBlock[] {
    const endDate = new Date(shifts.endDate.getTime() + DAY_IN_MILLISECONDS);

    const interval = getInterval(shifts.recurrenceInterval);

    const shiftTimes: TimeBlock[] = shifts.times.flatMap(
      ({ startTime, endTime }) => {
        const recurringShifts = [];
        if (interval > 0) {
          for (
            let start = startTime.getTime(), end = endTime.getTime();
            start < endDate.getTime();
            start += interval, end += interval
          ) {
            recurringShifts.push({
              startTime: new Date(start),
              endTime: new Date(end),
            });
          }
        } else {
          recurringShifts.push({
            startTime,
            endTime,
          });
        }
        return recurringShifts;
      },
    );

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
        this.isSameDateTime(shift.startTime, shiftTime.startTime) &&
        this.isSameDateTime(shift.endTime, shiftTime.endTime)
      ) {
        throw new Error(
          `Shift already exists with start time ${shift.startTime} and end time ${shift.endTime}`,
        );
      }
    });
  }

  // This is used to generate shift data when a new posting is created
  bulkGenerateTimeBlocks(
    shifts: ShiftBulkRequestWithoutPostingId,
  ): TimeBlock[] {
    try {
      const filteredShifts = shifts;

      // Skip shifts that are redundant (same start/end times)
      filteredShifts.times = this.getValidUniqueTimeBlocks(shifts.times);

      // Check that input times are valid
      const [valid, errorMessage] = this.validateTimeBlocks(
        filteredShifts.times,
      );
      if (!valid) throw new Error(errorMessage);

      // Build shiftTimes object
      return this.getTimeBlocksOnAfterEarliestDate(
        this.buildTimeBlocks(filteredShifts),
        shifts.startDate,
      );
    } catch (error) {
      Logger.error(
        `Failed to create shift. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  getValidUniqueTimeBlocks(times: TimeBlock[]): TimeBlock[] {
    // Skip redundant shifts
    return [...new Set(times.map((time) => JSON.stringify(time)))]
      .map((time) => JSON.parse(time))
      .map(({ startTime, endTime }) => {
        return {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        } as TimeBlock;
      });
  }

  convertSignupResponeWithUserAndVolunteerToDTO = (
    signup: SignupWithVolunteers,
    shiftStartTime: Date,
    shiftEndTime: Date,
  ): SignupsAndVolunteerResponseDTO => {
    if (signup.user.volunteer == null) {
      throw new Error("Volunteer should always be present");
    }
    return {
      ...signup,
      userId: String(signup.userId),
      shiftId: String(signup.shiftId),
      shiftStartTime,
      shiftEndTime,
      volunteer: {
        ...signup.user,
        ...signup.user.volunteer,
        id: String(signup.user.id),
      },
    };
  };

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

  async getShiftsByPosting(postingId: string): Promise<ShiftResponseDTO[]> {
    try {
      const shifts: Array<Shift> = await prisma.shift.findMany({
        where: {
          postingId: Number(postingId),
        },
      });
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

  async getShiftsWithSignupsAndVolunteers(): Promise<
    ShiftWithSignupAndVolunteerResponseDTO[]
  > {
    let shifts: ShiftWithSignupAndVolunteers[] = [];
    try {
      shifts = await prisma.shift.findMany({
        include: {
          signups: {
            include: {
              user: {
                include: {
                  volunteer: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      Logger.error(`Failed to get shifts. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return shifts.map((shift) => ({
      id: String(shift.id),
      postingId: String(shift.postingId),
      startTime: shift.startTime,
      endTime: shift.endTime,
      signups: shift.signups.map((shiftSignup) =>
        this.convertSignupResponeWithUserAndVolunteerToDTO(
          shiftSignup,
          shift.startTime,
          shift.endTime,
        ),
      ),
    }));
  }

  async getShiftsWithSignupAndVolunteerForPosting(
    postingId: string,
    userId: string | null,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftWithSignupAndVolunteerResponseDTO[]> {
    let shifts: ShiftWithSignupAndVolunteers[] = [];
    try {
      shifts = await prisma.shift.findMany({
        where: {
          postingId: Number(postingId),
        },
        include: {
          signups: {
            where: {
              userId: userId ? Number(userId) : undefined,
              status: signupStatus ?? undefined,
            },
            include: {
              user: {
                include: {
                  volunteer: true,
                },
              },
            },
          },
        },
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get shifts. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return shifts.map((shift) => ({
      id: String(shift.id),
      postingId: String(shift.postingId),
      startTime: shift.startTime,
      endTime: shift.endTime,
      signups: shift.signups.map((shiftSignup) =>
        this.convertSignupResponeWithUserAndVolunteerToDTO(
          shiftSignup,
          shift.startTime,
          shift.endTime,
        ),
      ),
    }));
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
      const filteredShifts = shifts;

      // Skip shifts that occur before start date
      filteredShifts.times = shifts.times.filter(
        (shift) => shift.startTime.getTime() >= shifts.startDate.getTime(),
      );

      // Check that input times are valid
      const [valid, errorMessage] = this.validateTimeBlocks(
        filteredShifts.times,
      );
      if (!valid) throw new Error(errorMessage);

      // Build shiftTimes object
      const shiftTimes: TimeBlock[] = this.buildTimeBlocks(filteredShifts);

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

      updateResult = await prisma.shift.update({
        where: { id: Number(shiftId) },
        data: {
          startTime: shift.startTime,
          endTime: shift.endTime,
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

import { PrismaClient, Signup, SignupStatus } from "@prisma/client";
import { Prisma, Shift } from ".prisma/client";

import IShiftSignupService from "../interfaces/shiftSignupService";
import {
  DeleteShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpsertShiftSignupDTO,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class ShiftSignupService implements IShiftSignupService {
  /* eslint-disable class-methods-use-this */
  convertSignupResponseToDTO = (
    signup: Signup,
    shift: Shift,
  ): ShiftSignupResponseDTO => {
    return {
      ...signup,
      shiftId: String(signup.shiftId),
      userId: String(signup.userId),
      shiftStartTime: shift.startTime,
      shiftEndTime: shift.endTime,
    };
  };

  async getShiftSignupsForUser(
    userId: string,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftSignupResponseDTO[]> {
    try {
      const filter: Prisma.SignupWhereInput = {
        AND: [
          {
            userId: Number(userId),
          },
          signupStatus
            ? {
                status: signupStatus,
              }
            : {},
        ],
      };
      const shiftSignups = await prisma.signup.findMany({
        where: {
          AND: [
            filter,
            {
              shift: {
                posting: {
                  endDate: { gt: new Date() },
                },
              },
            },
          ],
        },
        include: {
          shift: {
            include: {
              posting: true,
            },
          },
        },
      });

      let shift;
      let posting;
      return shiftSignups.map((signup) => {
        shift = signup.shift;
        posting = signup.shift.posting;

        return {
          ...signup,
          shiftId: String(signup.shiftId),
          userId: String(signup.userId),
          shiftStartTime: shift.startTime,
          shiftEndTime: shift.endTime,
          postingId: String(posting.id),
          postingTitle: posting.title,
          autoClosingDate: posting.autoClosingDate,
        };
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to shift signups. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getShiftSignupsForPosting(
    postingId: string,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftSignupResponseDTO[]> {
    try {
      const filter: Prisma.SignupWhereInput = {
        AND: [
          {
            shift: {
              postingId: Number(postingId),
            },
          },
          signupStatus
            ? {
                status: signupStatus,
              }
            : {},
        ],
      };
      const shiftSignups = await prisma.signup.findMany({
        where: filter,
        include: {
          shift: true,
        },
      });
      return shiftSignups.map((signup) =>
        this.convertSignupResponseToDTO(signup, signup.shift),
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to query shift signups. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async upsertDeleteShiftSignups(
    upsertShiftSignups: UpsertShiftSignupDTO[],
    deleteShiftSignups: DeleteShiftSignupDTO[],
  ): Promise<ShiftSignupResponseDTO[]> {
    try {
      const newShiftSignups = await prisma.$transaction([
        prisma.signup.deleteMany({
          where: {
            OR: deleteShiftSignups.map((deleteShiftSignup) => ({
              AND: {
                shiftId: Number(deleteShiftSignup.shiftId),
                userId: Number(deleteShiftSignup.userId),
              },
            })),
          },
        }),
        ...upsertShiftSignups.map((upsertShiftSignup) => {
          const { shiftId, userId, status, ...signup } = upsertShiftSignup;
          return prisma.signup.upsert({
            where: {
              shiftId_userId: {
                shiftId: Number(upsertShiftSignup.shiftId),
                userId: Number(upsertShiftSignup.userId),
              },
            },
            create: {
              ...signup,
              status: SignupStatus.PENDING,
              shiftId: Number(shiftId),
              userId: Number(userId),
            },
            update: {
              ...signup,
              shiftId: Number(shiftId),
              userId: Number(userId),
              ...(status === null ? {} : { status }),
            },
            include: {
              shift: true,
            },
          });
        }),
      ]);

      // Skip first transaction result for deleted count
      return newShiftSignups.slice(1).map((newShiftSignup) => {
        const signup = newShiftSignup as Signup & {
          shift: Shift;
        };
        return this.convertSignupResponseToDTO(signup, signup.shift);
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create shift signup. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ShiftSignupService;

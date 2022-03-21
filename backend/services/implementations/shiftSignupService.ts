import { PrismaClient, Signup, SignupStatus } from "@prisma/client";
import { Prisma, Shift } from ".prisma/client";

import IShiftSignupService from "../interfaces/shiftSignupService";
import {
  CreateShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class ShiftSignupService implements IShiftSignupService {
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
        `Failed to shift signups. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getShiftSignupsForPostingInDateRange(
    postingId: string,
    startDate: Date,
    endDate: Date,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftSignupResponseDTO[]> {
    try {
      const filter: Prisma.SignupWhereInput = {
        AND: [
          {
            shift: {
              postingId: Number(postingId),
              startTime: {
                gte: startDate,
                lte: endDate,
              },
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

  async createShiftSignups(
    shiftSignups: CreateShiftSignupDTO[],
  ): Promise<ShiftSignupResponseDTO[]> {
    try {
      const newShiftSignups = await prisma.$transaction(
        shiftSignups.map((shiftSignup) =>
          prisma.signup.create({
            data: {
              ...shiftSignup,
              shiftId: Number(shiftSignup.shiftId),
              userId: Number(shiftSignup.userId),
              status: SignupStatus.PENDING,
            },
            include: {
              shift: true,
            },
          }),
        ),
      );
      return newShiftSignups.map((newShiftSignup) =>
        this.convertSignupResponseToDTO(newShiftSignup, newShiftSignup.shift),
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to create shift signup. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateShiftSignup(
    shiftId: string,
    userId: string,
    shiftSignup: UpdateShiftSignupRequestDTO,
  ): Promise<ShiftSignupResponseDTO> {
    try {
      const updateResult = await prisma.signup.update({
        where: {
          shiftId_userId: {
            shiftId: Number(shiftId),
            userId: Number(userId),
          },
        },
        data: shiftSignup,
        include: {
          shift: true,
        },
      });
      return this.convertSignupResponseToDTO(updateResult, updateResult.shift);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update shift signup. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ShiftSignupService;

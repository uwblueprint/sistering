import { PrismaClient, Signup, SignupStatus } from "@prisma/client";

import IShiftSignupService from "../interfaces/shiftSignupService";
import {
  CreateShiftSignupDTO,
  ShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class ShiftSignupService implements IShiftSignupService {
  convertSignupToDTO = (signup: Signup): ShiftSignupDTO => {
    return {
      ...signup,
      shiftId: String(signup.shiftId),
      userId: String(signup.userId),
    };
  };

  async getShiftSignupsForUser(
    userId: string,
  ): Promise<ShiftSignupResponseDTO[]> {
    try {
      const shiftSignups = await prisma.signup.findMany({
        where: { userId: Number(userId) },
      });
      return shiftSignups.map((signup) => this.convertSignupToDTO(signup));
    } catch (error: unknown) {
      Logger.error(
        `Failed to shift signups. Reason = ${getErrorMessage(error)}`,
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
          }),
        ),
      );
      return newShiftSignups.map((newShiftSignup) =>
        this.convertSignupToDTO(newShiftSignup),
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
      });
      return this.convertSignupToDTO(updateResult);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update shift signup. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ShiftSignupService;

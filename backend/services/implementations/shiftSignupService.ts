import { PrismaClient, Signup, SignupStatus } from "@prisma/client";

import IShiftSignupService from "../interfaces/shiftSignupService";
import {
  CreateShiftSignupDTO,
  ShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
} from "../../types";
import logger from '../../utilities/logger';

const prisma = new PrismaClient();

const Logger = logger(__filename);

class ShiftSignupService implements IShiftSignupService {
  convertSignupToDTO = (signup: Signup): ShiftSignupDTO => {
    const { id, ...rest } = signup;
    return {
      ...rest,
      shiftId: String(rest.shiftId),
      userId: String(rest.userId),
    };
  }

  async createShiftSignups(shiftSignups: CreateShiftSignupDTO[]): Promise<ShiftSignupResponseDTO[]> {
    try {
      const newShiftSignups = await prisma.$transaction(
        shiftSignups?.map(shiftSignup => prisma.signup.create({
          data: {
            ...shiftSignup,
            shiftId: Number(shiftSignup.shiftId),
            userId: Number(shiftSignup.userId),
            status: SignupStatus.PENDING
          },
        }))
      );
      return newShiftSignups?.map(newShiftSignup => this.convertSignupToDTO(newShiftSignup));
    } catch (error) {
      Logger.error(`Failed to create shift signup. Reason = ${error.message}`);
      throw error;
    }
  }

  async updateShiftSignup(shiftId: string, userId: string, shiftSignup: UpdateShiftSignupRequestDTO): Promise<ShiftSignupResponseDTO> {
    try {
      const updateResult = await prisma.signup.update({
        where: { 
          shiftId_userId: { 
            shiftId: Number(shiftId),
            userId: Number(userId),
          },
        },
        data: shiftSignup,
      })
      return this.convertSignupToDTO(updateResult);
    } catch (error) {
      Logger.error(`Failed to update shift signup. Reason = ${error.message}`);
      throw error;
    }
  }

  async getShiftSignupsForUser(userId: string): Promise<ShiftSignupResponseDTO[]> {
    return [{
      shiftId: "",
      userId: "",
      numVolunteers: 0,
      note: "",
      status: 'PENDING'
    }];
  }
}

export default ShiftSignupService;

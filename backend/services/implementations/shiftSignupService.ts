import { PrismaClient, SignupStatus } from "@prisma/client";

import IShiftSignupService from "../interfaces/shiftSignupService";
import {
  CreateShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
} from "../../types";
import logger from '../../utilities/logger';

const prisma = new PrismaClient();

const Logger = logger(__filename);

class ShiftSignupService implements IShiftSignupService {
  async createShiftSignups(shiftSignups: CreateShiftSignupDTO[]): Promise<ShiftSignupResponseDTO[]> {
    try {
      const newShiftSignups = await prisma.$transaction(
        shiftSignups?.map(shiftSignup => prisma.signup.create({
          data: {
            ...shiftSignup,
            shiftId: Number(shiftSignup.shiftId),
            userId: Number(shiftSignup.userId),
            status: SignupStatus.PENDING
          }
        }))
      );
      return newShiftSignups?.map(newShiftSignup => ({
        ...newShiftSignup,
        shiftId: String(newShiftSignup.shiftId),
        userId: String(newShiftSignup.userId)
      }));
    } catch (error) {
      Logger.error(`Failed to create shift signup. Reason = ${error.message}`);
      throw error;
    }
  }

  async updateShiftSignup(shiftId: string, userId: string, shiftSignup: UpdateShiftSignupRequestDTO): Promise<ShiftSignupResponseDTO> {
    return {
      shiftId: "",
      userId: "",
      numVolunteers: 0,
      note: "",
      status: 'PENDING'
    };
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

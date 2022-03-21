import { SignupStatus } from "@prisma/client";
import ShiftSignupService from "../../services/implementations/shiftSignupService";
import IShiftSignupService from "../../services/interfaces/shiftSignupService";
import {
  CreateShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
} from "../../types";

const shiftSignupService: IShiftSignupService = new ShiftSignupService();

const shiftSignupResolvers = {
  Query: {
    getShiftSignupsForUser: async (
      _parent: undefined,
      {
        userId,
        signupStatus,
      }: { userId: string; signupStatus: SignupStatus | null },
    ): Promise<ShiftSignupResponseDTO[]> => {
      return shiftSignupService.getShiftSignupsForUser(userId, signupStatus);
    },

    getShiftSignupsForPostingInDateRange: async (
      _parent: undefined,
      {
        postingId,
        startDate,
        endDate,
        signupStatus,
      }: {
        postingId: string;
        startDate: Date;
        endDate: Date;
        signupStatus: SignupStatus | null;
      },
    ): Promise<ShiftSignupResponseDTO[]> => {
      return shiftSignupService.getShiftSignupsForPostingInDateRange(
        postingId,
        startDate,
        endDate,
        signupStatus,
      );
    },
  },
  Mutation: {
    createShiftSignups: async (
      _parent: undefined,
      { shifts }: { shifts: CreateShiftSignupDTO[] },
    ): Promise<ShiftSignupResponseDTO[]> => {
      return shiftSignupService.createShiftSignups(shifts);
    },

    updateShiftSignup: async (
      _parent: undefined,
      {
        shiftId,
        userId,
        update,
      }: {
        shiftId: string;
        userId: string;
        update: UpdateShiftSignupRequestDTO;
      },
    ): Promise<ShiftSignupResponseDTO> => {
      return shiftSignupService.updateShiftSignup(shiftId, userId, update);
    },
  },
};

export default shiftSignupResolvers;

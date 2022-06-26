import { SignupStatus } from "@prisma/client";
import ShiftSignupService from "../../services/implementations/shiftSignupService";
import IShiftSignupService from "../../services/interfaces/shiftSignupService";
import {
  ShiftSignupResponseDTO,
  UpsertDeleteShiftSignupsRequestDTO,
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

    getShiftSignupsForPosting: async (
      _parent: undefined,
      {
        postingId,
        signupStatus,
      }: {
        postingId: string;
        signupStatus: SignupStatus | null;
      },
    ): Promise<ShiftSignupResponseDTO[]> => {
      return shiftSignupService.getShiftSignupsForPosting(
        postingId,
        signupStatus,
      );
    },
  },
  Mutation: {

    upsertDeleteShiftSignups: async (
      _parent: undefined,
      {
        upsertDeleteShifts,
      }: {
        upsertDeleteShifts: UpsertDeleteShiftSignupsRequestDTO;
      },
    ): Promise<ShiftSignupResponseDTO[]> => {
      return shiftSignupService.upsertDeleteShiftSignups(
        upsertDeleteShifts.upsertShiftSignups,
        upsertDeleteShifts.deleteShiftSignups,
      );
    },
  },
};

export default shiftSignupResolvers;

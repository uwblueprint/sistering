import { SignupStatus } from "@prisma/client";
import ShiftService from "../../services/implementations/shiftService";
import IShiftService from "../../services/interfaces/IShiftService";
import {
  ShiftBulkRequestDTO,
  ShiftRequestDTO,
  ShiftResponseDTO,
  ShiftWithSignupAndVolunteerResponseDTO,
} from "../../types";

const shiftService: IShiftService = new ShiftService();

const shiftResolvers = {
  Query: {
    shift: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<ShiftResponseDTO> => {
      return shiftService.getShift(id);
    },
    shifts: async (): Promise<ShiftResponseDTO[]> => {
      return shiftService.getShifts();
    },
    shiftsByPosting: async (
      _parent: undefined,
      { postingId }: { postingId: string },
    ): Promise<ShiftResponseDTO[]> => {
      return shiftService.getShiftsByPosting(postingId);
    },
    shiftsWithSignupsAndVolunteersByPosting: async (
      _parent: undefined,
      {
        postingId,
        userId,
        signupStatus,
      }: {
        postingId: string;
        userId: string | null;
        signupStatus: SignupStatus | null;
      },
    ): Promise<ShiftWithSignupAndVolunteerResponseDTO[]> => {
      return shiftService.getShiftsWithSignupAndVolunteerForPosting(
        postingId,
        userId,
        signupStatus,
      );
    },
  },
  Mutation: {
    createShifts: async (
      _parent: undefined,
      { shifts }: { shifts: ShiftBulkRequestDTO },
    ): Promise<ShiftResponseDTO[]> => {
      const newShifts = await shiftService.createShifts(shifts);
      return newShifts;
    },
    updateShift: async (
      _parent: undefined,
      { shiftId, shift }: { shiftId: string; shift: ShiftRequestDTO },
    ): Promise<ShiftResponseDTO | null> => {
      return shiftService.updateShift(shiftId, shift);
    },
    updateShifts: async (
      _parent: undefined,
      { postingId, shifts }: { postingId: string; shifts: ShiftBulkRequestDTO },
    ): Promise<ShiftResponseDTO[] | null> => {
      return shiftService.updateShifts(postingId, shifts);
    },
    deleteShift: async (
      _parent: undefined,
      { shiftId }: { shiftId: string },
    ): Promise<string> => {
      return shiftService.deleteShift(shiftId);
    },
    deleteShifts: async (
      _parent: undefined,
      { postingId }: { postingId: string },
    ): Promise<string> => {
      return shiftService.deleteShifts(postingId);
    },
  },
};

export default shiftResolvers;

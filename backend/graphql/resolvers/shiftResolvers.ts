import ShiftService from "../../services/implementations/shiftService";
import IShiftService from "../../services/interfaces/IShiftService";
import {
  BulkShiftRequestDTO,
  ShiftRequestDTO,
  ShiftResponseDTO,
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
  },
  Mutation: {
    createShifts: async (
      _parent: undefined,
      { shifts }: { shifts: BulkShiftRequestDTO },
    ): Promise<ShiftResponseDTO[]> => {
      const newShifts = await shiftService.createShifts(shifts);
      return newShifts;
    },
    updateShift: async (
      _parent: undefined,
      { id, shift }: { id: string; shift: ShiftRequestDTO },
    ): Promise<ShiftResponseDTO | null> => {
      return shiftService.updateShift(id, shift);
    },
    updateShifts: async (
      _parent: undefined,
      { id, shifts }: { id: string; shifts: BulkShiftRequestDTO },
    ): Promise<ShiftResponseDTO[] | null> => {
      return shiftService.updateShifts(id, shifts);
    },
    deleteShift: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<void> => {
      return shiftService.deleteShift(id);
    },
    deleteShifts: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<void> => {
      return shiftService.deleteShifts(id);
    },
  },
};

export default shiftResolvers;

import ShiftSignupService from "../../services/implementations/shiftSignupService";
import IShiftSignupService from "../../services/interfaces/shiftSignupService";
import { CreateShiftSignupDTO, ShiftSignupResponseDTO, UpdateShiftSignupRequestDTO } from "../../types";

const shiftSignupService: IShiftSignupService = new ShiftSignupService();

const shiftSignupResolvers = {
  Query: {
    // userById: async (
    //   _parent: undefined,
    //   { id }: { id: string },
    // ): Promise<UserDTO> => {
    //   return userService.getUserById(id);
    // },
  },
  Mutation: {
    createShiftSignups: async (
      _parent: undefined,
      { shifts } : { shifts: CreateShiftSignupDTO[] },
    ): Promise<ShiftSignupResponseDTO[]> => {
      return shiftSignupService.createShiftSignups(shifts);
    },

    updateShiftSignup: async (
      _parent: undefined,
      { shiftId, userId, update }: { shiftId: string; userId: string; update: UpdateShiftSignupRequestDTO}
    ): Promise<ShiftSignupResponseDTO> => {
      return shiftSignupService.updateShiftSignup(shiftId, userId, update);
    }
  },
};

export default shiftSignupResolvers;

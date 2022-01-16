import ShiftSignupService from "../../services/implementations/shiftSignupService";
import IShiftSignupService from "../../services/interfaces/shiftSignupService";
import { CreateShiftSignupDTO, ShiftSignupResponseDTO } from "../../types";

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
    }
    // createUser: async (
    //   _parent: undefined,
    //   { user }: { user: CreateUserDTO },
    // ): Promise<UserDTO> => {
    //   const newUser = await userService.createUser(user);
    //   await authService.sendEmailVerificationLink(newUser.email);
    //   return newUser;
    // },
  },
};

export default shiftSignupResolvers;

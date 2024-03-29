import nodemailerConfig from "../../nodemailer.config";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import IEmailService from "../../services/interfaces/emailService";
import IUserService from "../../services/interfaces/userService";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  VolunteerUserResponseDTO,
  CreateVolunteerUserDTO,
  UpdateVolunteerUserDTO,
  EmployeeUserResponseDTO,
  UpdateEmployeeUserDTO,
  CreateEmployeeUserDTO,
  Role,
  UserInviteResponse,
} from "../../types";
import { generateCSV } from "../../utilities/CSVUtils";
import {
  adminAccountCreationInviteTemplate,
  volunteerAccountCreationInviteTemplate,
} from "../../utilities/templateUtils";

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);

const userResolvers = {
  Query: {
    userById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<UserDTO> => {
      return userService.getUserById(id);
    },
    userByEmail: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<UserDTO> => {
      return userService.getUserByEmail(email);
    },
    users: async (): Promise<UserDTO[]> => {
      return userService.getUsers();
    },
    usersCSV: async (): Promise<string> => {
      const users = await userService.getUsers();
      const csv = await generateCSV<UserDTO>({ data: users });
      return csv;
    },
    getUserInvite: async (
      _parent: undefined,
      { uuid }: { uuid: string },
    ): Promise<UserInviteResponse> => {
      return userService.getUserInvite(uuid);
    },
    getUserInvites: async (): Promise<Array<UserInviteResponse>> => {
      return userService.getUserInvites();
    },
    // VolunteerUsers
    volunteerUserById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<VolunteerUserResponseDTO> => {
      return userService.getVolunteerUserById(id);
    },
    volunteerUserByEmail: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<VolunteerUserResponseDTO> => {
      return userService.getVolunteerUserByEmail(email);
    },
    volunteerUsers: async (): Promise<VolunteerUserResponseDTO[]> => {
      return userService.getVolunteerUsers();
    },

    // EmployeeUsers
    employeeUserById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<EmployeeUserResponseDTO> => {
      return userService.getEmployeeUserById(id);
    },
    employeeUserByEmail: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<EmployeeUserResponseDTO> => {
      return userService.getEmployeeUserByEmail(email);
    },
    employeeUsers: async (): Promise<EmployeeUserResponseDTO[]> => {
      return userService.getEmployeeUsers();
    },
  },
  Mutation: {
    createUser: async (
      _parent: undefined,
      { user }: { user: CreateUserDTO },
    ): Promise<UserDTO> => {
      const newUser = await userService.createUser(user);
      return newUser;
    },
    updateUser: async (
      _parent: undefined,
      { id, user }: { id: string; user: UpdateUserDTO },
    ): Promise<UserDTO> => {
      return userService.updateUserById(id, user);
    },
    deleteUserById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<void> => {
      return userService.deleteUserById(id);
    },
    deleteUserByEmail: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<void> => {
      return userService.deleteUserByEmail(email);
    },
    createUserInvite: async (
      _parent: undefined,
      { email, role }: { email: string; role: Role },
    ): Promise<UserInviteResponse> => {
      const results = await userService.createUserInvite(email, role);
      let subject: string;
      let htmlBody: string;

      if (role === "VOLUNTEER") {
        htmlBody = volunteerAccountCreationInviteTemplate(
          `${process.env.SITE_URL}/create-account?token=${results.uuid}`,
        );
        subject = "Welcome to Your Volunteer Account";
      } else {
        htmlBody = adminAccountCreationInviteTemplate(
          `${process.env.SITE_URL}/create-account?token=${results.uuid}`,
        );
        subject = "Welcome to Your Admin Account";
      }

      await emailService.sendEmail(email, subject, htmlBody);
      return results;
    },
    deleteUserInvite: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<UserInviteResponse> => {
      return userService.deleteUserInvite(email);
    },

    // VolunteerUsers
    createVolunteerUser: async (
      _parent: undefined,
      { volunteerUser }: { volunteerUser: CreateVolunteerUserDTO },
    ): Promise<VolunteerUserResponseDTO> => {
      const newVolunteerUser = await userService.createVolunteerUser(
        volunteerUser,
      );
      return newVolunteerUser;
    },

    updateVolunteerUserById: async (
      _parent: undefined,
      {
        id,
        volunteerUser,
      }: { id: string; volunteerUser: UpdateVolunteerUserDTO },
    ): Promise<VolunteerUserResponseDTO> => {
      return userService.updateVolunteerUserById(id, volunteerUser);
    },

    deleteVolunteerUserById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return userService.deleteVolunteerUserById(id);
    },

    deleteVolunteerUserByEmail: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<string> => {
      return userService.deleteVolunteerUserByEmail(email);
    },

    // EmployeeUsers
    createEmployeeUser: async (
      _parent: undefined,
      { employeeUser }: { employeeUser: CreateEmployeeUserDTO },
    ): Promise<EmployeeUserResponseDTO> => {
      const newEmployeeUser = await userService.createEmployeeUser(
        employeeUser,
      );
      return newEmployeeUser;
    },

    updateEmployeeUserById: async (
      _parent: undefined,
      { id, employeeUser }: { id: string; employeeUser: UpdateEmployeeUserDTO },
    ): Promise<EmployeeUserResponseDTO> => {
      return userService.updateEmployeeUserById(id, employeeUser);
    },

    deleteEmployeeUserById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return userService.deleteEmployeeUserById(id);
    },

    deleteEmployeeUserByEmail: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<string> => {
      return userService.deleteEmployeeUserByEmail(email);
    },
  },
};

export default userResolvers;

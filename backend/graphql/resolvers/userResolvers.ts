import nodemailerConfig from "../../nodemailer.config";
import AuthService from "../../services/implementations/authService";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import IAuthService from "../../services/interfaces/authService";
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

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

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
      await authService.sendEmailVerificationLink(newUser.email);
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
      const SUBJECT = "Invitation to Sistering Platform";
      const htmlBody = `
<h3>Hello,</h3>
<br/>
<h3>You have received a user invite to join the Sistering volunteer platform. Please click the following link to set up your account. This link is only valid for 2 weeks.<h3/>
<br/>
<a href="https://sistering-dev.web.app/create-account?token=${results.uuid}>">Create Account</a>
`;
      await emailService.sendEmail(email, SUBJECT, htmlBody);
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
      await authService.sendEmailVerificationLink(newVolunteerUser.email);
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
      await authService.sendEmailVerificationLink(newEmployeeUser.email);
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

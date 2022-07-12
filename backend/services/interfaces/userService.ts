import {
  CreateUserDTO,
  Role,
  UpdateUserDTO,
  UserDTO,
  VolunteerUserResponseDTO,
  UpdateVolunteerUserDTO,
  CreateVolunteerUserDTO,
  CreateEmployeeUserDTO,
  EmployeeUserResponseDTO,
  UpdateEmployeeUserDTO,
  UserInviteResponse,
} from "../../types";
import IEmailService from "./emailService";

interface IUserService {
  /**
   * Get user associated with id
   * @param id user's id
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserById(userId: string): Promise<UserDTO>;

  /**
   * Get user associated with email
   * @param email user's email
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserByEmail(email: string): Promise<UserDTO>;

  /**
   * Get role of user associated with authId
   * @param authId user's authId
   * @returns role of the user
   * @throws Error if user role retrieval fails
   */
  getUserRoleByAuthId(authId: string): Promise<Role>;

  /**
   * Get id of user associated with authId
   * @param authId user's authId
   * @returns id of the user
   * @throws Error if user id retrieval fails
   */
  getUserIdByAuthId(authId: string): Promise<string>;

  /**
   * Get authId of user associated with id
   * @param userId user's id
   * @returns user's authId
   * @throws Error if user authId retrieval fails
   */
  getAuthIdById(userId: string): Promise<string>;

  /**
   * Get all user information (possibly paginated in the future)
   * @returns array of UserDTOs
   * @throws Error if user retrieval fails
   */
  getUsers(): Promise<Array<UserDTO>>;

  /**
   * Create a user, email verification configurable
   * @param user the user to be created
   * @param authId the user's firebase auth id, optional
   * @param signUpMethod the method user used to signup
   * @returns a UserDTO with the created user's information
   * @throws Error if user creation fails
   */
  createUser(user: CreateUserDTO, authId?: string): Promise<UserDTO>;

  /**
   * Update a user.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param user the user to be updated
   * @returns a UserDTO with the updated user's information
   * @throws Error if user update fails
   */
  updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO>;

  /**
   * Delete a user by id
   * @param userId user's userId
   * @throws Error if user deletion fails
   */
  deleteUserById(userId: string): Promise<void>;

  /**
   * Delete a user by email
   * @param email user's email
   * @throws Error if user deletion fails
   */
  deleteUserByEmail(email: string): Promise<void>;

  /**
   * Creates user invite link to send to user
   * @param email user's email
   * @param role role that the user will have
   * @throws Error if invite creation fails
   */
  createUserInvite(
    email: string,
    role: Role,
    emailService: IEmailService,
  ): Promise<UserInviteResponse>;

  /**
   * Get VolunteerUser associated with id
   * @param id VolunteerUser's id
   * @returns a VolunteerUserResponseDTO with VolunteerUser's information
   * @throws Error if VolunteerUser retrieval fails
   */
  getVolunteerUserById(userId: string): Promise<VolunteerUserResponseDTO>;

  /**
   * Get VolunteerUser associated with email
   * @param email VolunteerUser's email
   * @returns a VolunteerUserResponseDTO with VolunteerUser's information
   * @throws Error if VolunteerUser retrieval fails
   */
  getVolunteerUserByEmail(email: string): Promise<VolunteerUserResponseDTO>;

  /**
   * Get all VolunteerUser information (possibly paginated in the future)
   * @returns array of VolunteerUserResponseDTOs
   * @throws Error if VolunteerUser retrieval fails
   */
  getVolunteerUsers(): Promise<VolunteerUserResponseDTO[]>;

  /**
   * Create a VolunteerUser, email verification configurable
   * @param volunteerUser the VolunteerUser to be created
   * @param authId the VolunteerUser's firebase auth id, optional
   * @param signUpMethod the method VolunteerUser used to signup
   * @returns a VolunteerUserResponseDTO with the created VolunteerUser's information
   * @throws Error if VolunteerUser creation fails
   */
  createVolunteerUser(
    volunteerUser: CreateVolunteerUserDTO,
  ): Promise<VolunteerUserResponseDTO>;

  /**
   * Update a VolunteerUser.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param volunteerUser the VolunteerUser to be updated
   * @returns a VolunteerUserResponseDTO with the updated user's information
   * @throws Error if VolunteerUser update fails
   */
  updateVolunteerUserById(
    userId: string,
    volunteerUser: UpdateVolunteerUserDTO,
  ): Promise<VolunteerUserResponseDTO>;

  /**
   * Delete a VolunteerUser by id
   * @param userId user's userId
   * @throws Error if VolunteerUser deletion fails
   */
  deleteVolunteerUserById(userId: string): Promise<string>;

  /**
   * Delete a VolunteerUser by email
   * @param email user's email
   * @throws Error if VolunteerUser deletion fails
   */
  deleteVolunteerUserByEmail(email: string): Promise<string>;

  /**
   * Get EmployeeUser associated with id
   * @param id EmployeeUser's id
   * @returns a EmployeeUserResponseDTO with EmployeeUser's information
   * @throws Error if EmployeeUser retrieval fails
   */
  getEmployeeUserById(userId: string): Promise<EmployeeUserResponseDTO>;

  /**
   * Get EmployeeUser associated with email
   * @param email EmployeeUser's email
   * @returns a EmployeeUserResponseDTO with EmployeeUser's information
   * @throws Error if EmployeeUser retrieval fails
   */
  getEmployeeUserByEmail(email: string): Promise<EmployeeUserResponseDTO>;

  /**
   * Get all EmployeeUser information (possibly paginated in the future)
   * @returns array of EmployeeUserResponseDTOs
   * @throws Error if EmployeeUser retrieval fails
   */
  getEmployeeUsers(): Promise<EmployeeUserResponseDTO[]>;

  /**
   * Create a EmployeeUser, email verification configurable
   * @param employeeUser the EmployeeUser to be created
   * @param authId the EmployeeUser's firebase auth id, optional
   * @param signUpMethod the method EmployeeUser used to signup
   * @returns a EmployeeUserResponseDTO with the created EmployeeUser's information
   * @throws Error if EmployeeUser creation fails
   */
  createEmployeeUser(
    employeeUser: CreateEmployeeUserDTO,
  ): Promise<EmployeeUserResponseDTO>;

  /**
   * Update a EmployeeUser.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param volunteerUser the EmployeeUser to be updated
   * @returns a EmployeeUserResponseDTO with the updated user's information
   * @throws Error if EmployeeUser update fails
   */
  updateEmployeeUserById(
    userId: string,
    employeeUser: UpdateEmployeeUserDTO,
  ): Promise<EmployeeUserResponseDTO>;

  /**
   * Delete a EmployeeUser by id
   * @param userId user's userId
   * @throws Error if EmployeeUser deletion fails
   */
  deleteEmployeeUserById(userId: string): Promise<string>;

  /**
   * Delete a EmployeeUser by email
   * @param email user's email
   * @throws Error if EmployeeUser deletion fails
   */
  deleteEmployeeUserByEmail(email: string): Promise<string>;
}

export default IUserService;

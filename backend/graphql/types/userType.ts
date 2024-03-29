import { gql } from "apollo-server-express";

const userType = gql`
  enum Role {
    ADMIN
    VOLUNTEER
    EMPLOYEE
  }

  type UserDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    dateOfBirth: Date
    pronouns: String!
  }

  type VolunteerUserResponseDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    hireDate: Date
    dateOfBirth: Date
    pronouns: String!
    skills: [SkillResponseDTO!]!
    branches: [BranchResponseDTO!]!
    languages: [LanguageResponseDTO!]!
  }

  type VolunteerUserResponseNoSkillsBranchesEmailDTO {
    id: ID!
    firstName: String!
    lastName: String!
    role: Role!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    hireDate: Date
    dateOfBirth: Date
    pronouns: String!
    languages: [LanguageResponseDTO!]!
  }

  type EmployeeUserResponseDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    dateOfBirth: Date
    pronouns: String!
    branches: [BranchResponseDTO!]!
    languages: [LanguageResponseDTO!]!
  }

  input CreateUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    password: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    dateOfBirth: Date
    pronouns: String!
  }

  type UserInviteResponse {
    uuid: String!
    email: String!
    role: Role!
    createdAt: DateTime!
  }

  input UpdateUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    dateOfBirth: Date
    pronouns: String!
  }

  input CreateVolunteerUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    password: String!
    hireDate: Date!
    dateOfBirth: Date
    pronouns: String!
    skills: [ID!]!
    branches: [ID!]!
    languages: [ID!]!
    token: String!
  }

  input UpdateVolunteerUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    hireDate: Date!
    dateOfBirth: Date
    pronouns: String!
    skills: [ID!]!
    languages: [ID!]!
  }

  input CreateEmployeeUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    dateOfBirth: Date
    pronouns: String!
    password: String!
    branches: [ID!]!
    languages: [ID!]!
    token: String!
  }

  input UpdateEmployeeUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    dateOfBirth: Date
    pronouns: String!
    languages: [ID!]!
  }

  extend type Query {
    userById(id: ID!): UserDTO!
    userByEmail(email: String!): UserDTO!
    users: [UserDTO!]!
    usersCSV: String!
    getUserInvite(uuid: String!): UserInviteResponse!
    getUserInvites: [UserInviteResponse!]!
    volunteerUserById(id: ID!): VolunteerUserResponseDTO!
    volunteerUserByEmail(email: String!): VolunteerUserResponseDTO!
    volunteerUsers: [VolunteerUserResponseDTO!]!
    employeeUserById(id: ID!): EmployeeUserResponseDTO!
    employeeUserByEmail(email: String!): EmployeeUserResponseDTO!
    employeeUsers: [EmployeeUserResponseDTO!]!
  }

  extend type Mutation {
    createUser(user: CreateUserDTO!): UserDTO!
    updateUser(id: ID!, user: UpdateUserDTO!): UserDTO!
    deleteUserById(id: ID!): ID
    deleteUserByEmail(email: String!): ID
    createUserInvite(email: String!, role: Role!): UserInviteResponse!
    deleteUserInvite(email: String!): UserInviteResponse!
    createVolunteerUser(
      volunteerUser: CreateVolunteerUserDTO!
    ): VolunteerUserResponseDTO!
    updateVolunteerUserById(
      id: ID!
      volunteerUser: UpdateVolunteerUserDTO!
    ): VolunteerUserResponseDTO!
    deleteVolunteerUserById(id: ID!): ID!
    deleteVolunteerUserByEmail(email: String!): ID!
    createEmployeeUser(
      employeeUser: CreateEmployeeUserDTO!
    ): EmployeeUserResponseDTO!
    updateEmployeeUserById(
      id: ID!
      employeeUser: UpdateEmployeeUserDTO!
    ): EmployeeUserResponseDTO!
    deleteEmployeeUserById(id: ID!): ID!
    deleteEmployeeUserByEmail(email: String!): ID!
  }
`;

export default userType;

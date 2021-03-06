import { gql } from "apollo-server-express";

const userType = gql`
  enum Role {
    ADMIN
    VOLUNTEER
    EMPLOYEE
  }

  enum Language {
    ENGLISH
    FRENCH
    ITALIAN
    CHINESE
    SPANISH
    HINDI
    RUSSIAN
  }

  type UserDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
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
    pronouns: String
    skills: [SkillResponseDTO!]!
    branches: [BranchResponseDTO!]!
    languages: [Language]!
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
    pronouns: String
    languages: [Language]!
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
    branches: [BranchResponseDTO!]!
    languages: [Language]!
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
  }

  type UserInviteResponse {
    uuid: String!
    email: String!
    role: Role!
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
    pronouns: String
    skills: [ID!]!
    branches: [ID!]!
    languages: [Language]!
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
    pronouns: String
    skills: [ID!]!
    branches: [ID!]!
    languages: [Language]!
  }

  input CreateEmployeeUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    password: String!
    branches: [ID!]!
    languages: [Language]!
  }

  input UpdateEmployeeUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    emergencyContactName: String
    emergencyContactPhone: String
    emergencyContactEmail: String
    branches: [ID!]!
    languages: [Language]!
  }

  extend type Query {
    userById(id: ID!): UserDTO!
    userByEmail(email: String!): UserDTO!
    users: [UserDTO!]!
    usersCSV: String!
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

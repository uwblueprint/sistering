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
  }

  type VolunteerUserResponseDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    phoneNumber: String
    hireDate: Date
    dateOfBirth: Date
    pronouns: String
    skills: [SkillResponseDTO!]!
    branches: [BranchResponseDTO!]!
  }

  type EmployeeUserResponseDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    phoneNumber: String
    branchId: ID!
  }

  input CreateUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    password: String!
    phoneNumber: String
  }

  input UpdateUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    phoneNumber: String
  }

  input CreateVolunteerUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    password: String!
    hireDate: Date!
    dateOfBirth: Date
    pronouns: String
    skills: [ID!]!
    branches: [ID!]!
  }

  input UpdateVolunteerUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    hireDate: Date!
    dateOfBirth: Date
    pronouns: String
    skills: [ID!]!
    branches: [ID!]!
  }

  input CreateEmployeeUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    password: String!
    branchId: ID!
  }

  input UpdateEmployeeUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    branchId: ID!
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

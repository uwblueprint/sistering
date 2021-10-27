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

  type SkillDTO {
    id: ID!
    name: String!
  }

  type BranchDTO {
    id: ID!
    name: String!
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
    skills: [BranchDTO!]!
    branches: [SkillDTO!]!
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

  extend type Query {
    userById(id: ID!): UserDTO!
    userByEmail(email: String!): UserDTO!
    users: [UserDTO!]!
    usersCSV: String!
    volunteerUserById(id: ID!): VolunteerUserResponseDTO!
    volunteerUserByEmail(email: String!): VolunteerUserResponseDTO!
    volunteerUsers: [VolunteerUserResponseDTO!]!
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
  }
`;

export default userType;

import { gql } from "apollo-server-express";

const shiftSignupType = gql`
  enum SignupStatus {
    PENDING
    CONFIRMED
    CANCELED
  }

  input CreateShiftSignupRequestDTO {
    shiftId: ID!
    userId: ID!
    numVolunteers: Int!
    note: String!
  }

  input UpdateShiftSignupRequestDTO {
    numVolunteers: Int!
    note: String!
    status: SignupStatus!
  }

  type ShiftSignupResponseDTO {
    shiftId: ID!
    userId: ID!
    numVolunteers: Int!
    note: String!
    status: SignupStatus!
  }

  extend type Query {
    getShiftSignupsForUser(userId: ID!): [ShiftSignupResponseDTO!]!
  }

  extend type Mutation {
    createShiftSignups(
      shifts: [CreateShiftSignupRequestDTO!]!
    ): [ShiftSignupResponseDTO!]!
    updateShiftSignup(
      shiftId: ID!
      userId: ID!
      update: UpdateShiftSignupRequestDTO!
    ): ShiftSignupResponseDTO!
  }
`;

export default shiftSignupType;

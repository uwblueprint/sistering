import { gql } from "apollo-server-express";

const shiftSignupType = gql`
  enum SignupStatus {
    PENDING
    CONFIRMED
    CANCELED
    PUBLISHED
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

  input UpsertShiftSignupRequestDTO {
    shiftId: ID!
    userId: ID!
    numVolunteers: Int!
    note: String!
    status: SignupStatus
  }

  input DeleteShiftSignupRequestDTO {
    shiftId: ID!
    userId: ID!
  }

  input UpsertDeleteShiftSignupRequestDTO {
    upsertShiftSignups: [UpsertShiftSignupRequestDTO!]!
    deleteShiftSignups: [DeleteShiftSignupRequestDTO!]!
  }

  type ShiftSignupResponseDTO {
    shiftId: ID!
    shiftStartTime: DateTime!
    shiftEndTime: DateTime!
    userId: ID!
    numVolunteers: Int!
    note: String!
    status: SignupStatus!
  }

  extend type Query {
    getShiftSignupsForUser(
      userId: ID!
      signupStatus: SignupStatus
    ): [ShiftSignupResponseDTO!]!
    getShiftSignupsForPosting(
      postingId: ID!
      signupStatus: SignupStatus
    ): [ShiftSignupResponseDTO!]!
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
    upsertDeleteShiftSignups(
      upsertDeleteShifts: UpsertDeleteShiftSignupRequestDTO!
    ): [ShiftSignupResponseDTO!]!
  }
`;

export default shiftSignupType;

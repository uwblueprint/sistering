import { gql } from "apollo-server-express";

const shiftSignupType = gql`
  enum SignupStatus {
    PENDING
    CONFIRMED
    CANCELED
    PUBLISHED
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

  type ShiftSignupResponseWithVolunteersDTO {
    shiftId: ID!
    shiftStartTime: DateTime!
    shiftEndTime: DateTime!
    userId: ID!
    numVolunteers: Int!
    note: String!
    status: SignupStatus!
    volunteer: VolunteerUserResponseNoSkillsBranchesEmailDTO!
  }

  type ShiftSignupPostingResponseDTO {
    shiftId: ID!
    shiftStartTime: DateTime!
    shiftEndTime: DateTime!
    userId: ID!
    numVolunteers: Int!
    note: String!
    status: SignupStatus!
    postingId: ID!
    postingTitle: String!
    autoClosingDate: Date!
  }

  extend type Query {
    getShiftSignupsForUser(
      userId: ID!
      signupStatus: SignupStatus
    ): [ShiftSignupPostingResponseDTO!]!
    getShiftSignupsForPosting(
      postingId: ID!
      signupStatus: SignupStatus
    ): [ShiftSignupResponseDTO!]!
  }

  extend type Mutation {
    upsertDeleteShiftSignups(
      upsertDeleteShifts: UpsertDeleteShiftSignupRequestDTO!
    ): [ShiftSignupResponseDTO!]!
  }
`;

export default shiftSignupType;

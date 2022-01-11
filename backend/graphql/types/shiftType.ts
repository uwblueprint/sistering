import { gql } from "apollo-server-express";

const shiftType = gql`
  enum RecurrenceInterval {
    WEEKLY
    BIWEEKLY
    MONTHLY
    NONE
  }

  input TimeBlockDTO {
    date: String!
    startTime: String!
    endTime: String!
  }

  input ShiftBulkRequestDTO {
    postingId: String!
    times: [TimeBlockDTO!]!
    endDate: String!
    recurrenceInterval: RecurrenceInterval!
  }

  input ShiftRequestDTO {
    startTime: Date!
    endTime: Date!
  }

  type ShiftResponseDTO {
    id: ID!
    postingId: String!
    startTime: Date!
    endTime: Date!
  }

  extend type Query {
    shift(id: ID!): ShiftResponseDTO!
    shifts: [ShiftResponseDTO!]!
  }

  extend type Mutation {
    createShifts(shifts: ShiftBulkRequestDTO!): [ShiftResponseDTO!]!
    updateShift(shiftId: ID!, shift: ShiftRequestDTO!): ShiftResponseDTO!
    updateShifts(
      postingId: ID!
      shifts: ShiftBulkRequestDTO!
    ): [ShiftResponseDTO!]!
    deleteShift(shiftId: ID!): ID
    deleteShifts(postingId: ID!): ID
  }
`;

export default shiftType;

import { gql } from "apollo-server-express";

const shiftType = gql`
  enum RecurrenceInterval {
    WEEKLY
    BIWEEKLY
    MONTHLY
    NONE
  }

  input ShiftBulkRequestDTO {
    postingId: String!
    times: [ShiftRequestDTO!]!
    endDate: Date!
    recurrenceInterval: RecurrenceInterval!
  }

  input ShiftRequestDTO {
    startTime: DateTime!
    endTime: DateTime!
  }

  type ShiftResponseDTO {
    id: ID!
    postingId: String!
    startTime: DateTime!
    endTime: DateTime!
  }

  extend type Query {
    shift(id: ID!): ShiftResponseDTO!
    shifts: [ShiftResponseDTO!]!
    shiftsByPosting(postingId: ID!): [ShiftResponseDTO!]!
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

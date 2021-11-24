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

  input BulkShiftRequestDTO {
    postingId: String!
    times: [TimeBlockDTO!]!
    endDate: String!
    recurrenceInterval: RecurrenceInterval!
  }

  input ShiftRequestDTO {
    postingId: String!
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
    createShifts(shifts: BulkShiftRequestDTO!): [ShiftResponseDTO!]!
    updateShift(id: ID!, shift: ShiftRequestDTO!): ShiftResponseDTO!
    updateShifts(id: ID!, shifts: BulkShiftRequestDTO!): [ShiftResponseDTO!]!
    deleteShift(id: ID!): ID
    deleteShifts(id: ID!): ID
  }
`;

export default shiftType;

import { gql } from "apollo-server-express";

const postingType = gql`
  enum PostingType {
    INDIVIDUAL
    GROUP
  }

  enum PostingStatus {
    DRAFT
    PUBLISHED
  }

  input PostingRequestDTO {
    branchId: ID!
    skills: [ID!]!
    employees: [ID!]!
    title: String!
    type: PostingType!
    status: PostingStatus!
    description: String!
    startDate: Date!
    endDate: Date!
    autoClosingDate: Date!
    numVolunteers: Int!
  }

  input PostingWithShiftsRequestDTO {
    branchId: ID!
    skills: [ID!]!
    employees: [ID!]!
    title: String!
    type: PostingType!
    status: PostingStatus!
    description: String!
    startDate: Date!
    endDate: Date!
    autoClosingDate: Date!
    numVolunteers: Int!
    recurrenceInterval: RecurrenceInterval!
    times: [ShiftRequestDTO]!
  }

  type PostingResponseDTO {
    id: ID!
    branch: BranchResponseDTO!
    shifts: [ShiftResponseDTO!]!
    skills: [SkillResponseDTO!]!
    employees: [EmployeeUserResponseDTO!]!
    title: String!
    type: PostingType!
    status: PostingStatus!
    description: String!
    startDate: Date!
    endDate: Date!
    autoClosingDate: Date!
    numVolunteers: Int!
    isScheduled: Boolean!
    recurrenceInterval: RecurrenceInterval!
  }

  extend type Query {
    posting(id: ID!, userId: ID): PostingResponseDTO!
    postings(
      closingDate: Date
      statuses: [PostingStatus!]
      userId: ID
    ): [PostingResponseDTO!]!
  }

  extend type Mutation {
    createPosting(posting: PostingWithShiftsRequestDTO!): PostingResponseDTO!
    updatePosting(
      id: ID!
      posting: PostingWithShiftsRequestDTO!
    ): PostingResponseDTO!
    deletePosting(id: ID!): ID!
    duplicatePosting(id: ID!): ID!
  }
`;

export default postingType;

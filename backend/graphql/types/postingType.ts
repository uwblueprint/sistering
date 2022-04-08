import { gql } from "apollo-server-express";

const postingType = gql`
  enum PostingType {
    INDIVIDUAL
    GROUP
  }

  enum PostingStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
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

  type PostingResponseDTO {
    id: ID!
    branch: BranchResponseDTO!
    shifts: [ShiftResponseDTO!]!
    skills: [SkillResponseDTO!]!
    employees: [EmployeeResponseDTO!]!
    title: String!
    type: PostingType!
    status: PostingStatus!
    description: String!
    startDate: Date!
    endDate: Date!
    autoClosingDate: Date!
    numVolunteers: Int!
  }

  type EmployeeResponseDTO {
    id: ID!
    branchId: ID!
    title: String!
  }

  extend type Query {
    posting(id: ID!): PostingResponseDTO!
    postings: [PostingResponseDTO!]!
  }

  extend type Mutation {
    createPosting(posting: PostingRequestDTO!): PostingResponseDTO!
    updatePosting(id: ID!, posting: PostingRequestDTO!): PostingResponseDTO!
    deletePosting(id: ID!): ID!
  }
`;

export default postingType;

import { gql } from "apollo-server-express";

const postingType = gql`
  enum PostingType {
    INDIVIDUAL
    GROUP
  }

  input PostingRequestDTO {
    branchId: ID!
    skills: [ID!]!
    employees: [ID!]!
    title: String!
    type: PostingType!
    description: String!
    startDate: String!
    endDate: String!
    autoClosingDate: String!
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
    description: String!
    startDate: String!
    endDate: String!
    autoClosingDate: String!
    numVolunteers: Int!
  }

  type BranchResponseDTO {
    id: ID!
    name: String!
  }

  type EmployeeResponseDTO {
    id: ID!
    userId: ID!
    branchId: ID!
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

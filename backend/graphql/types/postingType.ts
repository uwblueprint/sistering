import { gql } from "apollo-server-express";

const postingType = gql`
  enum PostingType {
    INDIVIDUAL
    GROUP
  }

  input PostingRequestDTO {
    branchId: String!
    skills: [String]!
    employees: [String]!
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
    branchName: String!
    shifts: [String]!
    skillNames: [String]!
    employees: [String]!
    title: String!
    type: PostingType!
    description: String!
    startDate: String!
    endDate: String!
    autoClosingDate: String!
    numVolunteers: Int!
  }

  extend type Query {
    posting(id: ID!): PostingResponseDTO!
    postings: [PostingResponseDTO!]!
  }

  extend type Mutation {
    createPosting(posting: PostingRequestDTO!): PostingResponseDTO!
    updatePosting(id: ID!, posting: PostingRequestDTO!): PostingResponseDTO!
    deletePosting(id: ID!): ID
  }
`;

export default postingType;

import { gql } from "apollo-server-express";

const postingType = gql`
  enum PostingType {
    INDIVIDUAL
    GROUP
  }

  type PostingRequestDTO{
    id: ID!
    branchId: String;
    skills: [String];
    employee: String;
    title: String;
    type: PostingType;
    description: string;
    startDate: String;
    endDate: String;
    autoClosingDate: String;
    numVolunteers: Int;
  }

  input PostingResponseDTO {
    branchName: String;
    shifts: [String];
    skillNames: [String];
    employee: String;
    title: String;
    type: PostingType;
    description: String;
    startDate: String;
    endDate: String;
    autoClosingDate: String;
    numVolunteers: Int;
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

import { gql } from "apollo-server-express";

const postingType = gql`
  enum PostingType {
    INDIVIDUAL
    GROUP
  }

  type PostingRequestDTO{
    id: ID!
    branchId: String;
    shifts: [String];
    skills: [String];
    employee: String;
    title: String;
    type: PostingType;
    description: string;
    startDate: Date;
    endDate: Date;
    autoClosingDate: Date;
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
    startDate: Date;
    endDate: Date;
    autoClosingDate: Date;
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

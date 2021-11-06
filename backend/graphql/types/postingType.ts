import { gql } from "apollo-server-express";

const postingType = gql`
  type PostingResponseDTO {
    id: ID!
    # TODO: need BranchDTO
    # branch: Branch;
    # shifts: Shift[];
    # skills: PostingOnSkill[];
    employee: string;
    title: string;
    type: PostingType;
    description: string;
    startDate: Date;
    endDate: Date;
    autoClosingDate: Date;
    numVolunteers: number;
  }
  input PostingRequestDTO {
    # TODO: need BranchDTO
    # branch: Branch;
    # shifts: Shift[];
    # skills: PostingOnSkill[];
    employee: string;
    title: string;
    type: PostingType;
    description: string;
    startDate: Date;
    endDate: Date;
    autoClosingDate: Date;
    numVolunteers: number;
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

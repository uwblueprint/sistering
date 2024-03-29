import { gql } from "apollo-server-express";

const branchType = gql`
  input BranchRequestDTO {
    name: String!
  }
  type BranchResponseDTO {
    id: ID!
    name: String!
  }
  extend type Query {
    branch(id: ID!): BranchResponseDTO!
    branches: [BranchResponseDTO!]!
  }
  extend type Mutation {
    createBranch(branch: BranchRequestDTO!): BranchResponseDTO!
    updateBranch(id: ID!, branch: BranchRequestDTO!): BranchResponseDTO!
    deleteBranch(id: ID!): ID!
    updateUserBranchesByEmail(email: String!, branchIds: [ID!]!): ID!
    appendBranchesForMultipleUsersByEmail(
      emails: [String!]!
      branchIds: [ID!]!
    ): Boolean!
  }
`;

export default branchType;

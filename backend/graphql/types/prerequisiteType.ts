import { gql } from "apollo-server-express";

const prerequisiteType = gql`

  type PrerequisiteResponseDTO {
    id: ID!
    name: String!
    completed: Boolean!
    requiresAdminVerification: Boolean!
  }

  input PrerequisiteRequestDTO {
    name: String!
    completed: Boolean!
    requiresAdminVerification: Boolean!
  }

  extend type Query {
    prerequisite(id: ID!): PrerequisiteResponseDTO!
    prerequisites: [PrerequisiteResponseDTO!]!
  }

  extend type Mutation {    
    createPrerequisite(prerequisite: PrerequisiteRequestDTO!): PrerequisiteResponseDTO!
    updatePrerequisite(id: ID!, prerequisite: PrerequisiteRequestDTO!): PrerequisiteResponseDTO!
    deletePrerequisite(id: ID!): ID
  }
`;

export default prerequisiteType;

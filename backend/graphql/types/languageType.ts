import { gql } from "apollo-server-express";

const languageType = gql`
  type LanguageResponseDTO {
    id: ID!
    name: String!
  }
  input LanguageRequestDTO {
    name: String!
  }
  extend type Query {
    language(id: ID!): LanguageResponseDTO!
    languages: [LanguageResponseDTO!]!
  }
  extend type Mutation {
    createLanguage(language: LanguageRequestDTO!): LanguageResponseDTO!
    updateLanguage(id: ID!, language: LanguageRequestDTO!): LanguageResponseDTO!
    deleteLanguage(id: ID!): ID!
  }
`;

export default languageType;

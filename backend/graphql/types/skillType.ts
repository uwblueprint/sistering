import { gql } from "apollo-server-express";

const skillType = gql`
  type SkillResponseDTO {
    id: ID!
    name: String!
  }
  input SkillRequestDTO {
    name: String!
  }
  extend type Query {
    skill(id: ID!): SkillResponseDTO!
    skills: [SkillResponseDTO!]!
  }
  extend type Mutation {
    createSkill(skill: SkillRequestDTO!): SkillResponseDTO!
    updateSkill(id: ID!, skill: SkillRequestDTO!): SkillResponseDTO!
    deleteSkill(id: ID!): ID!
  }
`;

export default skillType;

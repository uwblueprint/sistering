import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";

import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import authResolvers from "./resolvers/authResolvers";
import authType from "./types/authType";
import entityResolvers from "./resolvers/entityResolvers";
import entityType from "./types/entityType";
import userResolvers from "./resolvers/userResolvers";
import userType from "./types/userType";
import postingResolvers from "./resolvers/postingResolvers";
import postingType from "./types/postingType";
import skillResolvers from "./resolvers/skillResolvers";
import skillType from "./types/skillType";

const query = gql`
  type Query {
    _empty: String
  }
`;

const mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [
    query,
    mutation,
    authType,
    entityType,
    userType,
    skillType,
    postingType,
  ],
  resolvers: merge(
    authResolvers,
    entityResolvers,
    userResolvers,
    postingResolvers,
    skillResolvers,
  ),
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["User", "Admin"]));
const authorizedByAdmin = () => isAuthorizedByRole(new Set(["Admin"]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(),
    entities: authorizedByAllRoles(),
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
    posting: authorizedByAdmin(),
    postings: authorizedByAdmin(),
    skill: authorizedByAdmin(),
    skills: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedByAdmin(),
    deleteUserByEmail: authorizedByAdmin(),
    logout: isAuthorizedByUserId("userId"),
    resetPassword: isAuthorizedByEmail("email"),
    createPosting: authorizedByAdmin(),
    updatePosting: authorizedByAdmin(),
    deletePosting: authorizedByAdmin(),
    createSkill: authorizedByAdmin(),
    updateSkill: authorizedByAdmin(),
    deleteSkill: authorizedByAdmin(),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);

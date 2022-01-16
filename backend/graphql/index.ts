import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";

import { isAuthorizedByRole, isAuthorizedByUserId } from "../middlewares/auth";
import authResolvers from "./resolvers/authResolvers";
import authType from "./types/authType";
import entityResolvers from "./resolvers/entityResolvers";
import entityType from "./types/entityType";
import userResolvers from "./resolvers/userResolvers";
import userType from "./types/userType";
import shiftResolvers from "./resolvers/shiftResolvers";
import shiftType from "./types/shiftType";
import shiftSignupResolvers from "./resolvers/shiftSignupResolvers";
import shiftSignupType from "./types/shiftSignupType";
import postingResolvers from "./resolvers/postingResolvers";
import postingType from "./types/postingType";
import skillResolvers from "./resolvers/skillResolvers";
import skillType from "./types/skillType";
import branchResolvers from "./resolvers/branchResolvers";
import branchType from "./types/branchType";

const query = gql`
  scalar Date
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
    shiftType,
    shiftSignupType,
    skillType,
    skillType,
    postingType,
    branchType,
  ],
  resolvers: merge(
    authResolvers,
    entityResolvers,
    userResolvers,
    shiftResolvers,
    shiftSignupResolvers,
    postingResolvers,
    skillResolvers,
    branchResolvers,
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
    shift: authorizedByAdmin(),
    shifts: authorizedByAdmin(),
    posting: authorizedByAdmin(),
    postings: authorizedByAdmin(),
    skill: authorizedByAdmin(),
    skills: authorizedByAdmin(),
    branch: authorizedByAdmin(),
    branches: authorizedByAdmin(),
    getShiftSignupsForUser: authorizedByAdmin(),
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
    createShifts: authorizedByAdmin(),
    updateShift: authorizedByAdmin(),
    updateShifts: authorizedByAdmin(),
    deleteShift: authorizedByAdmin(),
    deleteShifts: authorizedByAdmin(),
    createPosting: authorizedByAdmin(),
    updatePosting: authorizedByAdmin(),
    deletePosting: authorizedByAdmin(),
    createSkill: authorizedByAdmin(),
    updateSkill: authorizedByAdmin(),
    deleteSkill: authorizedByAdmin(),
    createBranch: authorizedByAdmin(),
    updateBranch: authorizedByAdmin(),
    deleteBranch: authorizedByAdmin(),
    createShiftSignups: authorizedByAdmin(),
    updateShiftSignups: authorizedByAdmin(),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);

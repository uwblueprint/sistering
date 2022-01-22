import { makeExecutableSchema, gql } from "apollo-server-express";
import { GraphQLScalarType, Kind } from "graphql";
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

const isValidDate = (dateString: string) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  if (!dateString.match(regEx)) return false; // Invalid format
  return (
    !Number.isNaN(Date.parse(dateString)) && // cover cases of DD > 31
    new Date(dateString).toISOString().slice(0, 10) === dateString // cover cases of DD <= 31
  );
};

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date type",
  serialize(value) {
    return value.toISOString().slice(0, 10); // value for client
  },
  parseValue(value) {
    if (isValidDate(value)) return new Date(value); // value for server
    throw new Error(`${value} is not a valid date in format YYYY-MM-DD`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (isValidDate(ast.value)) {
        return new Date(ast.value);
      }
      throw new Error(`${ast.value} was not a valid date in format YYYY-MM-DD`);
    }

    throw new Error(`${ast} is not valid`);
  },
});

const executableSchema = makeExecutableSchema({
  typeDefs: [
    query,
    mutation,
    authType,
    entityType,
    userType,
    shiftType,
    skillType,
    skillType,
    postingType,
    branchType,
  ],
  resolvers: merge(
    { Date: dateScalar },
    authResolvers,
    entityResolvers,
    userResolvers,
    shiftResolvers,
    postingResolvers,
    skillResolvers,
    branchResolvers,
  ),
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER", "EMPLOYEE"]));
const authorizedByAdmin = () => isAuthorizedByRole(new Set(["ADMIN"]));
const authorizedByAdminAndVolunteer = () =>
  isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"]));

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
    volunteerUserById: authorizedByAdminAndVolunteer(),
    volunteerUserByEmail: authorizedByAdminAndVolunteer(),
    volunteerUsers: authorizedByAdmin(),
    skill: authorizedByAdmin(),
    skills: authorizedByAdmin(),
    branch: authorizedByAdmin(),
    branches: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedByAdmin(),
    deleteUserByEmail: authorizedByAdmin(),
    createVolunteerUser: authorizedByAdminAndVolunteer(),
    updateVolunteerUserById: authorizedByAdminAndVolunteer(),
    deleteVolunteerUserById: authorizedByAdmin(),
    deleteVolunteerUserByEmail: authorizedByAdmin(),
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
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);

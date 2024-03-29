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
import shiftSignupResolvers from "./resolvers/shiftSignupResolvers";
import shiftSignupType from "./types/shiftSignupType";
import postingResolvers from "./resolvers/postingResolvers";
import postingType from "./types/postingType";
import skillResolvers from "./resolvers/skillResolvers";
import skillType from "./types/skillType";
import branchResolvers from "./resolvers/branchResolvers";
import branchType from "./types/branchType";
import languageResolvers from "./resolvers/languageResolvers";
import languageType from "./types/languageType";

const query = gql`
  scalar Date
  scalar DateTime
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

const isValidDateTime = (dateTimeString: string) => {
  const regEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/; // YYYY-MM-DDTHH:mm
  if (!dateTimeString.match(regEx)) return false; // Invalid format
  return (
    !Number.isNaN(Date.parse(`${dateTimeString}:00`)) && // cover cases of DD > 31
    new Date(`${dateTimeString}:00+00:00`).toISOString().slice(0, 16) ===
      dateTimeString
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

const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime type",
  serialize(value) {
    return value.toISOString().slice(0, 16); // value for client
  },
  parseValue(value) {
    if (isValidDateTime(value)) return new Date(`${value}:00+00:00`); // value for server
    throw new Error(`${value} is not a valid date in format YYYY-MM-DDTHH:mm`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (isValidDateTime(ast.value)) {
        return new Date(`${ast.value}:00+00:00`);
      }
      throw new Error(
        `${ast.value} was not a valid date in format YYYY-MM-DDTHH:mm`,
      );
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
    shiftSignupType,
    skillType,
    skillType,
    postingType,
    branchType,
    languageType,
  ],
  resolvers: merge(
    { Date: dateScalar },
    { DateTime: dateTimeScalar },
    authResolvers,
    entityResolvers,
    userResolvers,
    shiftResolvers,
    shiftSignupResolvers,
    postingResolvers,
    skillResolvers,
    branchResolvers,
    languageResolvers,
  ),
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER", "EMPLOYEE"]));
const authorizedByAdmin = () => isAuthorizedByRole(new Set(["ADMIN"]));
const authorizedByAdminAndVolunteer = () =>
  isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"]));
const authorizedByAdminAndEmployee = () =>
  isAuthorizedByRole(new Set(["ADMIN", "EMPLOYEE"]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(), // !DEPRECATED
    entities: authorizedByAllRoles(), // !DEPRECATED
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
    getUserInvites: authorizedByAdmin(),
    shift: authorizedByAdmin(),
    shifts: authorizedByAdmin(),
    shiftsByPosting: authorizedByAllRoles(),
    shiftsWithSignupsAndVolunteers: authorizedByAdminAndEmployee(),
    shiftsWithSignupsAndVolunteersByPosting: authorizedByAllRoles(),
    posting: authorizedByAllRoles(),
    postings: authorizedByAllRoles(),
    volunteerUserById: authorizedByAdminAndVolunteer(),
    volunteerUserByEmail: authorizedByAdminAndVolunteer(),
    volunteerUsers: authorizedByAdmin(),
    employeeUserById: authorizedByAdminAndEmployee(),
    employeeUserByEmail: authorizedByAdminAndEmployee(),
    employeeUsers: authorizedByAdmin(),
    branch: authorizedByAdminAndEmployee(),
    branches: authorizedByAdminAndEmployee(),
    getShiftSignupsForUser: authorizedByAdminAndVolunteer(),
    getShiftSignupsForPosting: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(), // !DEPRECATED
    updateEntity: authorizedByAllRoles(), // !DEPRECATED
    deleteEntity: authorizedByAllRoles(), // !DEPRECATED
    register: authorizedByAdmin(), // !DEPRECATED
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedByAdmin(),
    deleteUserByEmail: authorizedByAdmin(),
    createUserInvite: authorizedByAdmin(),
    updateVolunteerUserById: authorizedByAdminAndVolunteer(),
    deleteVolunteerUserById: authorizedByAdmin(),
    deleteVolunteerUserByEmail: authorizedByAdmin(),
    updateEmployeeUserById: authorizedByAdminAndEmployee(),
    deleteEmployeeUserById: authorizedByAdmin(),
    deleteEmployeeUserByEmail: authorizedByAdmin(),
    logout: isAuthorizedByUserId("userId"),
    createShifts: authorizedByAdmin(),
    updateShift: authorizedByAdmin(),
    updateShifts: authorizedByAdmin(),
    deleteShift: authorizedByAdmin(),
    deleteShifts: authorizedByAdmin(),
    createPosting: authorizedByAdmin(),
    updatePosting: authorizedByAdmin(),
    deletePosting: authorizedByAdmin(),
    duplicatePosting: authorizedByAdmin(),
    createSkill: authorizedByAllRoles(),
    updateSkill: authorizedByAdmin(),
    deleteSkill: authorizedByAdmin(),
    createBranch: authorizedByAdmin(),
    updateBranch: authorizedByAdmin(),
    deleteBranch: authorizedByAdmin(),
    createLanguage: authorizedByAllRoles(),
    updateLanguage: authorizedByAdmin(),
    deleteLanguage: authorizedByAdmin(),
    upsertDeleteShiftSignups: authorizedByAdminAndVolunteer(),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);

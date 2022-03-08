import { Request } from "express";
import { AuthenticationError, ExpressContext } from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";

import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import { Role } from "../types";

const authService: IAuthService = new AuthService(new UserService());

export const getAccessToken = (req: Request): string | null => {
  const authHeaderParts = req.headers.authorization?.split(" ");
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    return authHeaderParts[1];
  }
  return null;
};

/* Determine if request is authorized based on accessToken validity and role of client */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
export const isAuthorizedByRole = (roles: Set<Role>) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ): Promise<any> => {
    const accessToken = getAccessToken(context.req);
    const authorized =
      accessToken && (await authService.isAuthorizedByRole(accessToken, roles));

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by role",
      );
    }

    return resolve(parent, args, context, info);
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the userId that the token was issued to matches the requested userId
 * Note: userIdField is the name of the request parameter containing the requested userId */
export const isAuthorizedByUserId = (userIdField: string) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ): Promise<any> => {
    const accessToken = getAccessToken(context.req);
    const authorized =
      accessToken &&
      (await authService.isAuthorizedByUserId(accessToken, args[userIdField]));

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by userId",
      );
    }

    return resolve(parent, args, context, info);
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the userId that the token was issued to matches the requested userId
 * under all shifts for the createShiftSignups mutation and the user is a volunteer
 * Note: userIdField is the name of the request parameter containing the requested userId */
export const isAuthorizedForCreateShiftSignups = (userIdField: string) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ): Promise<any> => {
    const accessToken = getAccessToken(context.req);
    let authorized = false;
    if (accessToken) {
      const authorizedByVolunteer = await authService.isAuthorizedByRole(
        accessToken,
        new Set(["VOLUNTEER"]),
      );
      if (authorizedByVolunteer) {
        const authorizedArray = await Promise.all(
          args.shifts.map(async (shift: any) => {
            return authService.isAuthorizedByUserId(
              accessToken,
              shift[userIdField],
            );
          }),
        );
        authorized = !authorizedArray.includes(false);
      }
    }

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by userId",
      );
    }
    return resolve(parent, args, context, info);
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the user is an admin or (the userId that the token was issued to matches
 * the requested userId and the user is a volunteer)
 * Note: userIdField is the name of the request parameter containing the requested userId */
export const isAuthorizedForUpdateShiftSignups = (userIdField: string) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ): Promise<any> => {
    const accessToken = getAccessToken(context.req);
    let authorized = false;
    if (accessToken) {
      const authorizedByVolunteer =
        (await authService.isAuthorizedByRole(
          accessToken,
          new Set(["VOLUNTEER"]),
        )) &&
        (await authService.isAuthorizedByUserId(
          accessToken,
          args[userIdField],
        ));
      authorized =
        (await authService.isAuthorizedByRole(
          accessToken,
          new Set(["ADMIN"]),
        )) || authorizedByVolunteer;
    }

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by userId",
      );
    }

    return resolve(parent, args, context, info);
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the email that the token was issued to matches the requested email
 * Note: emailField is the name of the request parameter containing the requested email */
export const isAuthorizedByEmail = (emailField: string) => {
  return async (
    resolve: (
      parent: any,
      args: { [key: string]: any },
      context: ExpressContext,
      info: GraphQLResolveInfo,
    ) => any,
    parent: any,
    args: { [key: string]: any },
    context: ExpressContext,
    info: GraphQLResolveInfo,
  ): Promise<any> => {
    const accessToken = getAccessToken(context.req);
    const authorized =
      accessToken &&
      (await authService.isAuthorizedByEmail(accessToken, args[emailField]));

    if (!authorized) {
      throw new AuthenticationError(
        "Failed authentication and/or authorization by email",
      );
    }

    return resolve(parent, args, context, info);
  };
};

import * as firebaseAdmin from "firebase-admin";
import IUserService from "../interfaces/userService";
import { CreateUserDTO, Role, UpdateUserDTO, UserDTO } from "../../types";
import logger from "../../utilities/logger";
// import User from "../../models/user.model";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */

  async getUserById(userId: string): Promise<UserDTO> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);

      return {
        id: String(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: firebaseUser.email ?? "",
        role: user.role,
      };
    } catch (error) {
      Logger.error(`Failed to get user. Reason = ${error.message}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      const user = await prisma.user.findUnique({
        where: {
          authId: firebaseUser.uid,
        },
      });

      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }

      return {
        id: String(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: firebaseUser.email ?? "",
        role: user.role,
      };
    } catch (error) {
      Logger.error(`Failed to get user. Reason = ${error.message}`);
      throw error;
    }
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          authId: authId,
        },
      });
      if (!user) {
        throw new Error(`userId with authId ${authId} not found.`);
      }
      return user.role;
    } catch (error) {
      Logger.error(`Failed to get user role. Reason = ${error.message}`);
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          authId: authId,
        },
      });
      if (!user) {
        throw new Error(`user with authId ${authId} not found.`);
      }
      return String(user.id);
    } catch (error) {
      Logger.error(`Failed to get user id. Reason = ${error.message}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error) {
      Logger.error(`Failed to get authId. Reason = ${error.message}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users = await prisma.user.findMany();

      userDtos = await Promise.all(
        users.map(async (user) => {
          let firebaseUser: firebaseAdmin.auth.UserRecord;

          try {
            firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
          } catch (error) {
            Logger.error(
              `user with authId ${user.authId} could not be fetched from Firebase`,
            );
            throw error;
          }

          return {
            id: String(user.id),
            firstName: user.firstName,
            lastName: user.lastName,
            email: firebaseUser.email ?? "",
            role: user.role,
          };
        }),
      );
    } catch (error) {
      Logger.error(`Failed to get users. Reason = ${error.message}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(
    user: CreateUserDTO,
    authId?: string,
    signUpMethod = "PASSWORD",
  ): Promise<UserDTO> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      if (signUpMethod === "GOOGLE") {
        firebaseUser = await firebaseAdmin.auth().getUser(authId!);
      } else {
        // signUpMethod === PASSWORD
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: user.email,
          password: user.password,
        });
      }

      try {
        const newUser = await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            authId: firebaseUser.uid,
            role: user.role,
          },
        });

        return {
          id: String(newUser.id),
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: firebaseUser.email ?? "",
          role: newUser.role,
        };
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
            firebaseError.message,
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw postgresError;
      }
    } catch (error) {
      Logger.error(`Failed to create user. Reason = ${error.message}`);
      throw error;
    }
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const [oldUser, updateResult] = await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        }),
        prisma.user.update({
          where: {
            id: Number(userId)
          },
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        }),
      ]);

      if (!oldUser) {
        throw new Error(`userId ${userId} not found.`);
      }

      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(oldUser.authId, { email: user.email });
      } catch (error) {
        // rollback Postgres user updates
        try {
          await prisma.user.update({
            where: {
              id: Number(userId)
            },
            data: {
              firstName: oldUser.firstName,
              lastName: oldUser.lastName,
              role: oldUser.role,
            },
          });
        } catch (postgresError) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            postgresError.message,
            "Postgres user id with possibly inconsistent data =",
            oldUser.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error) {
      Logger.error(`Failed to update user. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: updatedFirebaseUser.email ?? "",
      role: user.role,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });
      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await prisma.user.create({
            data: {
              firstName: deletedUser.firstName,
              lastName: deletedUser.lastName,
              authId: deletedUser.authId,
              role: deletedUser.role,
            },
          });
        } catch (postgresError) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            postgresError.message,
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error) {
      Logger.error(`Failed to delete user. Reason = ${error.message}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser = await prisma.user.delete({
        where: {
          authId: firebaseUser.uid,
        },
      });

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await prisma.user.create({
            data: {
              firstName: deletedUser.firstName,
              lastName: deletedUser.lastName,
              authId: deletedUser.authId,
              role: deletedUser.role,
            },
          });
        } catch (postgresError) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            postgresError.message,
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error) {
      Logger.error(`Failed to delete user. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default UserService;


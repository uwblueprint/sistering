import * as firebaseAdmin from "firebase-admin";
import { PrismaClient, User, Volunteer, Skill, Branch } from "@prisma/client";
import IUserService from "../interfaces/userService";
import {
  CreateUserDTO,
  Role,
  UpdateUserDTO,
  UserDTO,
  VolunteerUserResponseDTO,
  CreateVolunteerUserDTO,
  UpdateVolunteerUserDTO,
  BranchResponseDTO,
  SkillResponseDTO,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

// Helper Functions
const convertToBranchResponseDTO = (
  branches: Branch[],
): BranchResponseDTO[] => {
  return branches.map((branch: Branch) => {
    return {
      id: String(branch.id),
      name: branch.name,
    };
  });
};

const convertToSkillResponseDTO = (skills: Skill[]): SkillResponseDTO[] => {
  return skills.map((skill: Skill) => {
    return {
      id: String(skill.id),
      name: skill.name,
    };
  });
};

const convertToNumberIds = (ids: string[]): { id: number }[] => {
  return ids.map((id: string) => {
    return {
      id: Number(id),
    };
  });
};

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */

  async getUserById(userId: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error: any) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await prisma.user.findUnique({
        where: {
          authId: firebaseUser.uid,
        },
      });

      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }
    } catch (error: any) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          authId,
        },
      });
      if (!user) {
        throw new Error(`userId with authId ${authId} not found.`);
      }
      return user.role;
    } catch (error: any) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          authId,
        },
      });
      if (!user) {
        throw new Error(`user with authId ${authId} not found.`);
      }
      return String(user.id);
    } catch (error: any) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user: User | null = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error: any) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users: Array<User> = await prisma.user.findMany();

      userDtos = await Promise.all(
        users.map(async (user) => {
          let firebaseUser: firebaseAdmin.auth.UserRecord;

          try {
            firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
          } catch (error: unknown) {
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
            phoneNumber: user.phoneNumber,
          };
        }),
      );
    } catch (error: any) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(
    user: CreateUserDTO,
    authId?: string,
    signUpMethod = "PASSWORD",
  ): Promise<UserDTO> {
    let newUser: User;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      if (signUpMethod === "GOOGLE") {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        firebaseUser = await firebaseAdmin.auth().getUser(authId!);
      } else {
        // signUpMethod === PASSWORD
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: user.email,
          password: user.password,
        });
      }

      try {
        newUser = await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            authId: firebaseUser.uid,
            role: user.role,
            phoneNumber: user.phoneNumber,
          },
        });
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: any) {
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
    } catch (error: any) {
      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(newUser.id),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: firebaseUser.email ?? "",
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
    };
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const [oldUser] = await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        }),
        prisma.user.update({
          where: {
            id: Number(userId),
          },
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phoneNumber: user.phoneNumber,
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
      } catch (error: unknown) {
        // rollback Postgres user updates
        try {
          await prisma.user.update({
            where: {
              id: Number(userId),
            },
            data: {
              firstName: oldUser.firstName,
              lastName: oldUser.lastName,
              role: oldUser.role,
              phoneNumber: oldUser.phoneNumber,
            },
          });
        } catch (postgresError: any) {
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
    } catch (error: any) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: updatedFirebaseUser.email ?? "",
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser: User | null = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });
      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error: unknown) {
        // rollback user deletion in Postgres
        try {
          await prisma.user.create({
            data: {
              firstName: deletedUser.firstName,
              lastName: deletedUser.lastName,
              authId: deletedUser.authId,
              role: deletedUser.role,
              phoneNumber: deletedUser.phoneNumber,
            },
          });
        } catch (postgresError: any) {
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
    } catch (error: any) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser: User | null = await prisma.user.delete({
        where: {
          authId: firebaseUser.uid,
        },
      });

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error: unknown) {
        // rollback user deletion in Postgres
        try {
          await prisma.user.create({
            data: {
              firstName: deletedUser.firstName,
              lastName: deletedUser.lastName,
              authId: deletedUser.authId,
              role: deletedUser.role,
              phoneNumber: deletedUser.phoneNumber,
            },
          });
        } catch (postgresError: any) {
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
    } catch (error: any) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getVolunteerUserById(
    userId: string,
  ): Promise<VolunteerUserResponseDTO> {
    try {
      const volunteer = await prisma.volunteer.findUnique({
        where: { id: Number(userId) },
        include: {
          branches: true,
          skills: true,
          user: true,
        },
      });

      if (!volunteer) {
        throw new Error(`Volunteer with userId ${userId} not found.`);
      }

      const { user } = volunteer;
      const firebaseUser = await firebaseAdmin.auth().getUser(user.authId);

      return {
        id: String(user.id),
        email: firebaseUser.email ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        hireDate: volunteer.hireDate,
        dateOfBirth: volunteer.dateOfBirth,
        pronouns: volunteer.pronouns,
        skills: convertToSkillResponseDTO(volunteer.skills),
        branches: convertToBranchResponseDTO(volunteer.branches),
      };
    } catch (error: any) {
      Logger.error(
        `Failed to get volunteer user. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getVolunteerUserByEmail(
    email: string,
  ): Promise<VolunteerUserResponseDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      const user = await prisma.user.findUnique({
        where: {
          authId: firebaseUser.uid,
        },
        include: {
          volunteer: {
            include: {
              branches: true,
              skills: true,
            },
          },
        },
      });

      if (!user || !user.volunteer) {
        throw new Error(`No User or Volunteer with email ${email}.`);
      }

      const { volunteer } = user;

      return {
        id: String(user.id),
        email: firebaseUser.email ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        hireDate: volunteer.hireDate,
        dateOfBirth: volunteer.dateOfBirth,
        pronouns: volunteer.pronouns,
        skills: convertToSkillResponseDTO(volunteer.skills),
        branches: convertToBranchResponseDTO(volunteer.branches),
      };
    } catch (error: any) {
      Logger.error(
        `Failed to get volunteer user. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getVolunteerUsers(): Promise<VolunteerUserResponseDTO[]> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const volunteers = await prisma.volunteer.findMany({
        include: {
          user: true,
          branches: true,
          skills: true,
        },
      });
      const volunteerUsers = await Promise.all(
        volunteers.map(async (volunteer) => {
          firebaseUser = await firebaseAdmin
            .auth()
            .getUser(volunteer.user.authId!);

          return {
            ...volunteer.user,
            ...volunteer,
            id: String(volunteer.id),
            email: firebaseUser.email ?? "",
            skills: convertToSkillResponseDTO(volunteer.skills),
            branches: convertToBranchResponseDTO(volunteer.branches),
          };
        }),
      );
      return volunteerUsers;
    } catch (error: any) {
      Logger.error(
        `Failed to get volunteer user. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createVolunteerUser(
    volunteerUser: CreateVolunteerUserDTO,
    authId?: string,
    signUpMethod = "PASSWORD",
  ): Promise<VolunteerUserResponseDTO> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      if (signUpMethod === "GOOGLE") {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        firebaseUser = await firebaseAdmin.auth().getUser(authId!);
      } else {
        // signUpMethod === PASSWORD
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: volunteerUser.email,
          password: volunteerUser.password,
        });
      }

      try {
        // nested writes provide transactional guarantees
        const newUser = await prisma.user.create({
          data: {
            firstName: volunteerUser.firstName,
            lastName: volunteerUser.lastName,
            authId: firebaseUser.uid,
            role: "VOLUNTEER",
            phoneNumber: volunteerUser.phoneNumber,
            volunteer: {
              create: {
                hireDate: volunteerUser.hireDate,
                pronouns: volunteerUser.pronouns ?? "",
                dateOfBirth: volunteerUser.dateOfBirth ?? "",
                branches: {
                  connect: convertToNumberIds(volunteerUser.branches),
                },
                skills: {
                  connect: convertToNumberIds(volunteerUser.skills),
                },
              },
            },
          },
          include: {
            volunteer: {
              include: {
                branches: true,
                skills: true,
              },
            },
          },
        });

        const { volunteer } = newUser;

        return {
          ...newUser,
          id: String(newUser.id),
          email: firebaseUser.email ?? "",
          hireDate: volunteer!.hireDate,
          dateOfBirth: volunteer!.dateOfBirth,
          pronouns: volunteer!.pronouns,
          skills: convertToSkillResponseDTO(volunteer!.skills),
          branches: convertToBranchResponseDTO(volunteer!.branches),
        };
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: any) {
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
    } catch (error: any) {
      Logger.error(
        `Failed to create VolunteerUser. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateVolunteerUserById(
    userId: string,
    volunteerUser: UpdateVolunteerUserDTO,
  ): Promise<VolunteerUserResponseDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const [
        oldVolunteerUser,
        updatedVolunteerUser,
      ] = await prisma.$transaction([
        prisma.volunteer.findUnique({
          where: {
            id: Number(userId),
          },
          include: {
            skills: true,
            branches: true,
            user: true,
          },
        }),
        prisma.volunteer.update({
          where: {
            id: Number(userId),
          },
          data: {
            hireDate: volunteerUser.hireDate,
            pronouns: volunteerUser.pronouns ?? "",
            dateOfBirth: volunteerUser.dateOfBirth ?? "",
            branches: {
              set: [], // setting the related branches to be [] before connecting the passed in values
              connect: convertToNumberIds(volunteerUser.branches),
            },
            skills: {
              set: [], // setting the related skills to be [] before connecting the passed in values
              connect: convertToNumberIds(volunteerUser.skills),
            },
            user: {
              update: {
                firstName: volunteerUser.firstName,
                lastName: volunteerUser.lastName,
                role: "VOLUNTEER",
                phoneNumber: volunteerUser.phoneNumber,
              },
            },
          },
          include: {
            branches: true,
            skills: true,
            user: true,
          },
        }),
      ]);
      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(updatedVolunteerUser.user.authId, {
            email: volunteerUser.email,
          });

        const { user } = updatedVolunteerUser;

        return {
          ...user,
          id: String(user.id),
          email: updatedFirebaseUser.email ?? "",
          hireDate: updatedVolunteerUser.hireDate,
          dateOfBirth: updatedVolunteerUser.dateOfBirth,
          pronouns: updatedVolunteerUser.pronouns,
          skills: convertToSkillResponseDTO(updatedVolunteerUser.skills),
          branches: convertToBranchResponseDTO(updatedVolunteerUser.branches),
        };
      } catch (error: any) {
        try {
          prisma.volunteer.update({
            where: {
              id: Number(userId),
            },
            data: {
              hireDate: oldVolunteerUser!.hireDate,
              pronouns: oldVolunteerUser!.pronouns,
              dateOfBirth: oldVolunteerUser!.dateOfBirth,
              branches: {
                connect: oldVolunteerUser!.branches,
              },
              skills: {
                connect: oldVolunteerUser!.skills,
              },
              user: {
                update: {
                  firstName: oldVolunteerUser!.user.firstName,
                  lastName: oldVolunteerUser!.user.lastName,
                  role: oldVolunteerUser!.user.role,
                  phoneNumber: oldVolunteerUser!.user.phoneNumber,
                },
              },
            },
          });
        } catch (postgresError: any) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            postgresError.message,
            "Postgres user id with possibly inconsistent data =",
            oldVolunteerUser?.id,
          ];
          Logger.error(errorMessage.join(" "));
        }
        throw error;
      }
    } catch (error: any) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteVolunteerUserById(userId: string): Promise<string> {
    try {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      const [_, deletedVolunteerUser] = await prisma.$transaction([
        // use update to remove relations from volunteer and user before deleting
        prisma.user.update({
          where: {
            id: Number(userId),
          },
          data: {
            signups: {
              set: [],
            },
            volunteer: {
              update: {
                branches: {
                  set: [],
                },
                skills: {
                  set: [],
                },
              },
            },
          },
        }),
        prisma.user.delete({
          where: {
            id: Number(userId),
          },
          include: {
            volunteer: {
              include: {
                branches: true,
                skills: true,
              },
            },
          },
        }),
      ]);
      try {
        await firebaseAdmin.auth().deleteUser(deletedVolunteerUser.authId);
      } catch (error: unknown) {
        // rollback user deletion in Postgres
        try {
          const { volunteer: deletedVolunteer } = deletedVolunteerUser;
          await prisma.user.create({
            data: {
              firstName: deletedVolunteerUser.firstName,
              lastName: deletedVolunteerUser.lastName,
              authId: deletedVolunteerUser.authId,
              role: deletedVolunteerUser.role,
              phoneNumber: deletedVolunteerUser.phoneNumber,
              volunteer: {
                create: {
                  hireDate: deletedVolunteer!.hireDate,
                  pronouns: deletedVolunteer!.pronouns ?? "",
                  dateOfBirth: deletedVolunteer!.dateOfBirth ?? "",
                  branches: {
                    connect: deletedVolunteer!.branches.map((b) => {
                      return {
                        id: Number(b.id),
                      };
                    }),
                  },
                  skills: {
                    connect: deletedVolunteer!.skills.map((s) => {
                      return {
                        id: Number(s.id),
                      };
                    }),
                  },
                },
              },
            },
            include: {
              volunteer: {
                include: {
                  branches: true,
                  skills: true,
                },
              },
            },
          });
        } catch (postgresError: any) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            postgresError.message,
            "Firebase uid with non-existent Postgres record =",
            deletedVolunteerUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }

      return String(deletedVolunteerUser.id);
    } catch (error: any) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteVolunteerUserByEmail(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    await this.deleteVolunteerUserById(user.id);
    return String(user.id);
  }
}

export default UserService;

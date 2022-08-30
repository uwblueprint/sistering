/* eslint-disable class-methods-use-this */
import * as firebaseAdmin from "firebase-admin";
import { PrismaClient, User, Skill, Branch, Language } from "@prisma/client";
import IUserService from "../interfaces/userService";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  VolunteerUserResponseDTO,
  CreateVolunteerUserDTO,
  UpdateVolunteerUserDTO,
  BranchResponseDTO,
  SkillResponseDTO,
  CreateEmployeeUserDTO,
  EmployeeUserResponseDTO,
  UpdateEmployeeUserDTO,
  UserInviteResponse,
  LanguageResponseDTO,
  Role,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import { getWeekDiff } from "../../utilities/dateUtils";
import convertToNumberIds from "../../utilities/typeUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

// Helper Functions
export const convertToBranchResponseDTO = (
  branches: Branch[],
): BranchResponseDTO[] => {
  return branches.map((branch: Branch) => {
    return {
      id: String(branch.id),
      name: branch.name,
    };
  });
};

export const convertToSkillResponseDTO = (
  skills: Skill[],
): SkillResponseDTO[] => {
  return skills.map((skill: Skill) => {
    return {
      id: String(skill.id),
      name: skill.name,
    };
  });
};

export const convertToLanguageResponseDTO = (
  languages: Language[],
): LanguageResponseDTO[] => {
  return languages.map((language: Language) => {
    return {
      id: String(language.id),
      name: language.name,
    };
  });
};

const isInviteExpired = (createdDate: Date): boolean => {
  return getWeekDiff(createdDate, new Date()) >= 2;
};

class UserService implements IUserService {
  async getUserById(userId: string): Promise<UserDTO> {
    let user;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          languages: true,
        },
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error: unknown) {
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
      languages: convertToLanguageResponseDTO(user.languages),
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
      pronouns: user.pronouns,
      dateOfBirth: user.dateOfBirth,
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await prisma.user.findUnique({
        where: {
          authId: firebaseUser.uid,
        },
        include: {
          languages: true,
        },
      });

      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }
    } catch (error: unknown) {
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
      languages: convertToLanguageResponseDTO(user.languages),
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
      pronouns: user.pronouns,
      dateOfBirth: user.dateOfBirth,
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users = await prisma.user.findMany({
        include: { languages: true },
      });

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
            languages: convertToLanguageResponseDTO(user.languages),
            emergencyContactName: user.emergencyContactName,
            emergencyContactPhone: user.emergencyContactPhone,
            emergencyContactEmail: user.emergencyContactEmail,
            pronouns: user.pronouns,
            dateOfBirth: user.dateOfBirth,
          };
        }),
      );
    } catch (error: unknown) {
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
    let newUser;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      // signUpMethod === PASSWORD
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
      });

      try {
        newUser = await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            authId: firebaseUser.uid,
            role: user.role,
            phoneNumber: user.phoneNumber,
            languages: {
              connect: convertToNumberIds(user.languages),
            },
            emergencyContactName: user.emergencyContactName,
            emergencyContactPhone: user.emergencyContactPhone,
            emergencyContactEmail: user.emergencyContactEmail,
            pronouns: user.pronouns,
            dateOfBirth: user.dateOfBirth,
          },
          include: {
            languages: true,
          },
        });
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw postgresError;
      }
    } catch (error: unknown) {
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
      languages: convertToLanguageResponseDTO(newUser.languages),
      emergencyContactName: newUser.emergencyContactName,
      emergencyContactPhone: newUser.emergencyContactPhone,
      emergencyContactEmail: newUser.emergencyContactEmail,
      pronouns: newUser.pronouns,
      dateOfBirth: newUser.dateOfBirth,
    };
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;
    let updatedUser;

    try {
      const [oldUser, updated] = await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
          include: {
            languages: true,
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
            languages: {
              set: [],
              connect: convertToNumberIds(user.languages),
            },
            emergencyContactName: user.emergencyContactName,
            emergencyContactPhone: user.emergencyContactPhone,
            emergencyContactEmail: user.emergencyContactEmail,
            pronouns: user.pronouns,
            dateOfBirth: user.dateOfBirth,
          },
          include: {
            languages: true,
          },
        }),
      ]);
      updatedUser = updated;

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
              languages: {
                set: [],
                connect: oldUser.languages.map((l) => {
                  return {
                    id: Number(l.id),
                  };
                }),
              },
              emergencyContactName: oldUser.emergencyContactName,
              emergencyContactPhone: oldUser.emergencyContactPhone,
              emergencyContactEmail: oldUser.emergencyContactEmail,
              pronouns: oldUser.pronouns,
              dateOfBirth: oldUser.dateOfBirth,
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            oldUser.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
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
      languages: convertToLanguageResponseDTO(updatedUser.languages),
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
      pronouns: user.pronouns,
      dateOfBirth: user.dateOfBirth,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
        include: {
          languages: true,
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
              languages: {
                connect: deletedUser.languages.map((l) => {
                  return {
                    id: Number(l.id),
                  };
                }),
              },
              emergencyContactName: deletedUser.emergencyContactName,
              emergencyContactPhone: deletedUser.emergencyContactPhone,
              emergencyContactEmail: deletedUser.emergencyContactEmail,
              pronouns: deletedUser.pronouns,
              dateOfBirth: deletedUser.dateOfBirth,
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
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
        include: {
          languages: true,
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
              languages: {
                connect: deletedUser.languages.map((l) => {
                  return {
                    id: Number(l.id),
                  };
                }),
              },
              emergencyContactName: deletedUser.emergencyContactName,
              emergencyContactPhone: deletedUser.emergencyContactPhone,
              emergencyContactEmail: deletedUser.emergencyContactEmail,
              pronouns: deletedUser.pronouns,
              dateOfBirth: deletedUser.dateOfBirth,
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUserInvite(uuid: string): Promise<UserInviteResponse> {
    try {
      const userInvite = await prisma.userInvite.findUnique({
        where: {
          uuid,
        },
      });

      if (userInvite === null) {
        // not found
        throw new Error(
          "Failed to get user invite with token. Reason = user is not allowed to create an account",
        );
      }

      if (getWeekDiff(userInvite.createdAt, new Date()) >= 2) {
        const resultsFromDeletion = await this.deleteUserInvite(
          userInvite.email,
        );
        if (resultsFromDeletion != null) {
          throw new Error(
            "Failed to allow user to create account. Reason = User Invite age exceeded accepted time period (2 weeks), user invite has been removed",
          );
        } else {
          throw new Error(
            "Failed to allow user to create account. Reason = User Invite age exceeded accepted time period (2 weeks), attempted to remove user invite but error occurred",
          );
        }
      }

      return {
        uuid: userInvite.uuid,
        role: userInvite.role.toString() as Role,
        email: userInvite.email,
        createdAt: userInvite.createdAt,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user invite. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserInvites(): Promise<Array<UserInviteResponse>> {
    let userInvites: Array<UserInviteResponse> = [];
    try {
      const expiredInvitesUuids: Array<string> = [];

      const invites = await prisma.userInvite.findMany();
      invites.forEach((invite) => {
        if (isInviteExpired(invite.createdAt)) {
          expiredInvitesUuids.push(invite.uuid);
        } else {
          userInvites.push(invite);
        }
      });

      await prisma.userInvite.deleteMany({
        where: { uuid: { in: expiredInvitesUuids } },
      });

      userInvites = await Promise.all(
        userInvites.map((invite) => {
          return {
            uuid: invite.uuid,
            role: invite.role.toString() as Role,
            email: invite.email,
            createdAt: invite.createdAt,
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user invite. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return userInvites;
  }

  async createUserInvite(
    email: string,
    role: Role,
  ): Promise<UserInviteResponse> {
    try {
      let user = null;
      await firebaseAdmin
        .auth()
        .getUserByEmail(email)
        .then(async (firebaseUser) => {
          user = await prisma.user.findUnique({
            where: {
              authId: firebaseUser.uid,
            },
          });
        })
        .catch(() => {});

      if (user !== null) {
        throw new Error(
          "Create User Invite failed. Reason = Email already exists",
        );
      }

      const userInvite = await prisma.userInvite.create({
        data: {
          email,
          role,
        },
      });
      return {
        email: userInvite.email,
        role: userInvite.role.toString() as Role,
        uuid: userInvite.uuid,
        createdAt: userInvite.createdAt,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to create user invite row. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteUserInvite(email: string): Promise<UserInviteResponse> {
    try {
      const userInvite = await prisma.userInvite.delete({
        where: {
          email,
        },
      });
      return {
        email: userInvite.email,
        role: userInvite.role.toString() as Role,
        uuid: userInvite.uuid,
        createdAt: userInvite.createdAt,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete user invite row. Reason = ${getErrorMessage(error)}`,
      );
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
          user: {
            include: {
              languages: true,
            },
          },
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
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        emergencyContactEmail: user.emergencyContactEmail,
        dateOfBirth: user.dateOfBirth,
        pronouns: user.pronouns,
        hireDate: volunteer.hireDate,
        languages: convertToLanguageResponseDTO(user.languages),
        skills: convertToSkillResponseDTO(volunteer.skills),
        branches: convertToBranchResponseDTO(volunteer.branches),
      };
    } catch (error: unknown) {
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
          languages: true,
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
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        emergencyContactEmail: user.emergencyContactEmail,
        dateOfBirth: user.dateOfBirth,
        pronouns: user.pronouns,
        hireDate: volunteer.hireDate,
        skills: convertToSkillResponseDTO(volunteer.skills),
        branches: convertToBranchResponseDTO(volunteer.branches),
        languages: convertToLanguageResponseDTO(user.languages),
      };
    } catch (error: unknown) {
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
          user: {
            include: {
              languages: true,
            },
          },
          branches: true,
          skills: true,
        },
      });
      const volunteerUsers = await Promise.all(
        volunteers.map(async (volunteer) => {
          firebaseUser = await firebaseAdmin
            .auth()
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            .getUser(volunteer.user.authId!);

          return {
            ...volunteer.user,
            ...volunteer,
            id: String(volunteer.id),
            email: firebaseUser.email ?? "",
            languages: convertToLanguageResponseDTO(volunteer.user.languages),
            skills: convertToSkillResponseDTO(volunteer.skills),
            branches: convertToBranchResponseDTO(volunteer.branches),
          };
        }),
      );
      return volunteerUsers;
    } catch (error: unknown) {
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
      const userInvite = await prisma.userInvite.findUnique({
        where: {
          uuid: volunteerUser.token,
        },
      });

      if (userInvite === null) {
        // not found
        throw new Error(
          "Failed to get user invite with token - user is not allowed to create an account",
        );
      } else if (userInvite.role !== "VOLUNTEER") {
        throw new Error(
          "User invite with associated token does not have matching role - cannot create account",
        );
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to check user invite. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    try {
      // signUpMethod === PASSWORD
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: volunteerUser.email,
        password: volunteerUser.password,
      });

      try {
        // nested writes provide transactional guarantees
        const newUser = await prisma.user.create({
          data: {
            firstName: volunteerUser.firstName,
            lastName: volunteerUser.lastName,
            authId: firebaseUser.uid,
            role: "VOLUNTEER",
            phoneNumber: volunteerUser.phoneNumber,
            languages: {
              connect: convertToNumberIds(volunteerUser.languages),
            },
            emergencyContactName: volunteerUser.emergencyContactName,
            emergencyContactPhone: volunteerUser.emergencyContactPhone,
            emergencyContactEmail: volunteerUser.emergencyContactEmail,
            pronouns: volunteerUser.pronouns,
            dateOfBirth: volunteerUser.dateOfBirth,
            volunteer: {
              create: {
                hireDate: volunteerUser.hireDate,
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
            languages: true,
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
          languages: convertToLanguageResponseDTO(newUser.languages),
          email: firebaseUser.email ?? "",
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          hireDate: volunteer!.hireDate,
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          skills: convertToSkillResponseDTO(volunteer!.skills),
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          branches: convertToBranchResponseDTO(volunteer!.branches),
        };
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw postgresError;
      }
    } catch (error: unknown) {
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
                languages: {
                  set: [],
                  connect: convertToNumberIds(volunteerUser.languages),
                },
                emergencyContactName: volunteerUser.emergencyContactName,
                emergencyContactPhone: volunteerUser.emergencyContactPhone,
                emergencyContactEmail: volunteerUser.emergencyContactEmail,
                pronouns: volunteerUser.pronouns,
                dateOfBirth: volunteerUser.dateOfBirth ?? "",
              },
            },
          },
          include: {
            branches: true,
            skills: true,
            user: {
              include: {
                languages: true,
              },
            },
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
          languages: convertToLanguageResponseDTO(user.languages),
          email: updatedFirebaseUser.email ?? "",
          hireDate: updatedVolunteerUser.hireDate,
          skills: convertToSkillResponseDTO(updatedVolunteerUser.skills),
          branches: convertToBranchResponseDTO(updatedVolunteerUser.branches),
        };
      } catch (error: unknown) {
        try {
          prisma.volunteer.update({
            where: {
              id: Number(userId),
            },
            data: {
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              hireDate: oldVolunteerUser!.hireDate,
              branches: {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                connect: oldVolunteerUser!.branches,
              },
              skills: {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                connect: oldVolunteerUser!.skills,
              },
              user: {
                update: {
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  firstName: oldVolunteerUser!.user.firstName,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  lastName: oldVolunteerUser!.user.lastName,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  role: oldVolunteerUser!.user.role,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  phoneNumber: oldVolunteerUser!.user.phoneNumber,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  emergencyContactName: oldVolunteerUser!.user
                    .emergencyContactName,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  emergencyContactPhone: oldVolunteerUser!.user
                    .emergencyContactPhone,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  emergencyContactEmail: oldVolunteerUser!.user
                    .emergencyContactEmail,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  pronouns: oldVolunteerUser!.user.pronouns,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  dateOfBirth: oldVolunteerUser!.user.dateOfBirth,
                },
              },
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            oldVolunteerUser?.id,
          ];
          Logger.error(errorMessage.join(" "));
        }
        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteVolunteerUserById(userId: string): Promise<string> {
    try {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      const deletedVolunteerUser = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
        include: {
          languages: true,
          volunteer: {
            include: {
              branches: true,
              skills: true,
            },
          },
        },
      });
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
              languages: {
                connect: deletedVolunteerUser.languages.map((l) => {
                  return {
                    id: Number(l.id),
                  };
                }),
              },
              emergencyContactName: deletedVolunteerUser.emergencyContactName,
              emergencyContactPhone: deletedVolunteerUser.emergencyContactPhone,
              emergencyContactEmail: deletedVolunteerUser.emergencyContactEmail,
              pronouns: deletedVolunteerUser.pronouns,
              dateOfBirth: deletedVolunteerUser.dateOfBirth ?? "",
              volunteer: {
                create: {
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  hireDate: deletedVolunteer!.hireDate,
                  branches: {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    connect: deletedVolunteer!.branches.map((b) => {
                      return {
                        id: Number(b.id),
                      };
                    }),
                  },
                  skills: {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    connect: deletedVolunteer!.skills.map((s) => {
                      return {
                        id: Number(s.id),
                      };
                    }),
                  },
                },
              },
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedVolunteerUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }

      return String(deletedVolunteerUser.id);
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteVolunteerUserByEmail(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    await this.deleteVolunteerUserById(user.id);
    return String(user.id);
  }

  async getEmployeeUserById(userId: string): Promise<EmployeeUserResponseDTO> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: Number(userId) },
        include: {
          user: {
            include: {
              languages: true,
            },
          },
          branches: true,
        },
      });

      if (!employee) {
        throw new Error(`Employee with userId ${userId} not found.`);
      }

      const { user } = employee;
      const firebaseUser = await firebaseAdmin.auth().getUser(user.authId);

      return {
        id: String(user.id),
        email: firebaseUser.email ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        languages: convertToLanguageResponseDTO(user.languages),
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        emergencyContactEmail: user.emergencyContactEmail,
        branches: convertToBranchResponseDTO(employee.branches),
        pronouns: user.pronouns,
        dateOfBirth: user.dateOfBirth,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to get employee user. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getEmployeeUserByEmail(
    email: string,
  ): Promise<EmployeeUserResponseDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      const user = await prisma.user.findUnique({
        where: {
          authId: firebaseUser.uid,
        },
        include: {
          languages: true,
          employee: {
            include: {
              branches: true,
            },
          },
        },
      });

      if (!user || !user.employee) {
        throw new Error(`No User or Employee with email ${email}.`);
      }

      const { employee } = user;

      return {
        id: String(user.id),
        email: firebaseUser.email ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        emergencyContactEmail: user.emergencyContactEmail,
        role: user.role,
        languages: convertToLanguageResponseDTO(user.languages),
        branches: convertToBranchResponseDTO(employee.branches),
        pronouns: user.pronouns,
        dateOfBirth: user.dateOfBirth,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to get employee user. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getEmployeeUsers(): Promise<EmployeeUserResponseDTO[]> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const employees = await prisma.employee.findMany({
        include: {
          user: {
            include: {
              languages: true,
            },
          },
          branches: true,
        },
      });
      const employeeUsers = await Promise.all(
        employees.map(async (employee) => {
          firebaseUser = await firebaseAdmin
            .auth()
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            .getUser(employee.user.authId!);

          return {
            ...employee.user,
            ...employee,
            id: String(employee.id),
            languages: convertToLanguageResponseDTO(employee.user.languages),
            email: firebaseUser.email ?? "",
            branches: convertToBranchResponseDTO(employee.branches),
          };
        }),
      );
      return employeeUsers;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get employee user. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createEmployeeUser(
    employeeUser: CreateEmployeeUserDTO,
    authId?: string,
    signUpMethod = "PASSWORD",
  ): Promise<EmployeeUserResponseDTO> {
    let firebaseUser: firebaseAdmin.auth.UserRecord;
    let userRole: Role;
    try {
      const userInvite = await prisma.userInvite.findUnique({
        where: {
          uuid: employeeUser.token,
        },
      });

      if (userInvite === null) {
        // not found
        throw new Error(
          "Failed to get user invite with token - user is not allowed to create account",
        );
      } else if (
        !(userInvite.role === "EMPLOYEE" || userInvite.role === "ADMIN")
      ) {
        throw new Error(
          "User invite with associated token does not have matching role - cannot create account",
        );
      }
      userRole = userInvite.role;
    } catch (error: unknown) {
      Logger.error(
        `Failed to check user invite. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    try {
      // signUpMethod === PASSWORD
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: employeeUser.email,
        password: employeeUser.password,
      });

      try {
        // nested writes provide transactional guarantees
        const newUser = await prisma.user.create({
          data: {
            firstName: employeeUser.firstName,
            lastName: employeeUser.lastName,
            authId: firebaseUser.uid,
            role: userRole,
            phoneNumber: employeeUser.phoneNumber,
            emergencyContactName: employeeUser.emergencyContactName,
            emergencyContactPhone: employeeUser.emergencyContactPhone,
            emergencyContactEmail: employeeUser.emergencyContactEmail,
            pronouns: employeeUser.pronouns,
            dateOfBirth: employeeUser.dateOfBirth,
            languages: {
              connect: convertToNumberIds(employeeUser.languages),
            },
            employee: {
              create: {
                branches: {
                  connect: convertToNumberIds(employeeUser.branches),
                },
              },
            },
          },
          include: {
            languages: true,
            employee: {
              include: {
                branches: true,
              },
            },
          },
        });

        const { employee } = newUser;

        return {
          ...newUser,
          id: String(newUser.id),
          email: firebaseUser.email ?? "",
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          branches: convertToBranchResponseDTO(employee!.branches),
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          languages: convertToBranchResponseDTO(newUser.languages),
        };
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw postgresError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to create EmployeeUser. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateEmployeeUserById(
    userId: string,
    employeeUser: UpdateEmployeeUserDTO,
  ): Promise<EmployeeUserResponseDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const oldEmployeeUser = await prisma.employee.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          user: true,
          branches: true,
        },
      });
      const updatedEmployeeUser = await prisma.employee.update({
        where: {
          id: Number(userId),
        },
        data: {
          user: {
            update: {
              firstName: employeeUser.firstName,
              lastName: employeeUser.lastName,
              role: oldEmployeeUser?.user.role,
              phoneNumber: employeeUser.phoneNumber,
              emergencyContactName: employeeUser.emergencyContactName,
              emergencyContactPhone: employeeUser.emergencyContactPhone,
              emergencyContactEmail: employeeUser.emergencyContactEmail,
              languages: {
                set: [],
                connect: convertToNumberIds(employeeUser.languages),
              },
              pronouns: employeeUser.pronouns,
              dateOfBirth: employeeUser.dateOfBirth,
            },
          },
        },
        include: {
          branches: true,
          user: {
            include: {
              languages: true,
            },
          },
        },
      });
      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(updatedEmployeeUser.user.authId, {
            email: employeeUser.email,
          });

        const { user } = updatedEmployeeUser;

        return {
          ...user,
          id: String(user.id),
          email: updatedFirebaseUser.email ?? "",
          branches: convertToSkillResponseDTO(updatedEmployeeUser.branches),
          languages: convertToLanguageResponseDTO(user.languages),
        };
      } catch (error: unknown) {
        try {
          prisma.employee.update({
            where: {
              id: Number(userId),
            },
            data: {
              user: {
                update: {
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  firstName: oldEmployeeUser!.user.firstName,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  lastName: oldEmployeeUser!.user.lastName,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  role: oldEmployeeUser!.user.role,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  phoneNumber: oldEmployeeUser!.user.phoneNumber,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  emergencyContactName: oldEmployeeUser!.user
                    .emergencyContactName,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  emergencyContactPhone: oldEmployeeUser!.user
                    .emergencyContactPhone,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  emergencyContactEmail: oldEmployeeUser!.user
                    .emergencyContactEmail,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  pronouns: oldEmployeeUser!.user.pronouns,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  dateOfBirth: oldEmployeeUser!.user.dateOfBirth,
                },
              },
              branches: {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                connect: oldEmployeeUser!.branches,
              },
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            oldEmployeeUser?.id,
          ];
          Logger.error(errorMessage.join(" "));
        }
        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteEmployeeUserById(userId: string): Promise<string> {
    try {
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      const deletedEmployeeUser = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
        include: {
          employee: {
            include: {
              branches: true,
              postings: true,
            },
          },
        },
      });
      try {
        await firebaseAdmin.auth().deleteUser(deletedEmployeeUser.authId);
      } catch (error: unknown) {
        // rollback user deletion in Postgres
        try {
          const { employee: deletedEmployee } = deletedEmployeeUser;
          await prisma.user.create({
            data: {
              firstName: deletedEmployeeUser.firstName,
              lastName: deletedEmployeeUser.lastName,
              authId: deletedEmployeeUser.authId,
              role: deletedEmployeeUser.role,
              phoneNumber: deletedEmployeeUser.phoneNumber,
              emergencyContactName: deletedEmployeeUser.emergencyContactName,
              emergencyContactPhone: deletedEmployeeUser.emergencyContactPhone,
              emergencyContactEmail: deletedEmployeeUser.emergencyContactEmail,
              pronouns: deletedEmployeeUser.pronouns,
              dateOfBirth: deletedEmployeeUser.dateOfBirth,
              employee: {
                create: {
                  branches: {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    connect: deletedEmployee!.branches.map((p) => {
                      return { id: Number(p.id) };
                    }),
                  },
                  postings: {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    connect: deletedEmployee!.postings.map((p) => {
                      return { id: Number(p.id) };
                    }),
                  },
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                },
              },
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedEmployeeUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }

      return String(deletedEmployeeUser.id);
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteEmployeeUserByEmail(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    await this.deleteEmployeeUserById(user.id);
    return String(user.id);
  }
}

export default UserService;

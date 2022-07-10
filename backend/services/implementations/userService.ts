/* eslint-disable class-methods-use-this */
import * as firebaseAdmin from "firebase-admin";
import { PrismaClient, User, Skill, Branch } from "@prisma/client";
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
  CreateUserInviteResponse,
  Role,
} from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

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

const convertToNumberIds = (ids: string[]): { id: number }[] => {
  return ids.map((id: string) => {
    return {
      id: Number(id),
    };
  });
};

class UserService implements IUserService {
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
      languages: user.languages,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
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
      languages: user.languages,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
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
            languages: user.languages,
            emergencyContactName: user.emergencyContactName,
            emergencyContactPhone: user.emergencyContactPhone,
            emergencyContactEmail: user.emergencyContactEmail,
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
    let newUser: User;
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
            languages: user.languages,
            emergencyContactName: user.emergencyContactName,
            emergencyContactPhone: user.emergencyContactPhone,
            emergencyContactEmail: user.emergencyContactEmail,
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
      languages: newUser.languages,
      emergencyContactName: newUser.emergencyContactName,
      emergencyContactPhone: newUser.emergencyContactPhone,
      emergencyContactEmail: newUser.emergencyContactEmail,
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
            languages: user.languages,
            emergencyContactName: user.emergencyContactName,
            emergencyContactPhone: user.emergencyContactPhone,
            emergencyContactEmail: user.emergencyContactEmail,
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
              languages: oldUser.languages,
              emergencyContactName: oldUser.emergencyContactName,
              emergencyContactPhone: oldUser.emergencyContactPhone,
              emergencyContactEmail: oldUser.emergencyContactEmail,
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
      languages: user.languages,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactEmail: user.emergencyContactEmail,
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
              languages: deletedUser.languages,
              emergencyContactName: deletedUser.emergencyContactName,
              emergencyContactPhone: deletedUser.emergencyContactPhone,
              emergencyContactEmail: deletedUser.emergencyContactEmail,
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
              languages: deletedUser.languages,
              emergencyContactName: deletedUser.emergencyContactName,
              emergencyContactPhone: deletedUser.emergencyContactPhone,
              emergencyContactEmail: deletedUser.emergencyContactEmail,
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

  async createUserInvite(
    email: string,
    role: Role,
  ): Promise<CreateUserInviteResponse> {
    try {
      const userInvite = await prisma.userInvite.create({
        data: {
          email,
          role,
        },
      });
      return {
        email: userInvite.email,
        role: userInvite.role.toString() as Role,
        pid: userInvite.pid,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to create user invite row. Reason = ${getErrorMessage(error)}`,
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
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        emergencyContactEmail: user.emergencyContactEmail,
        hireDate: volunteer.hireDate,
        dateOfBirth: volunteer.dateOfBirth,
        pronouns: volunteer.pronouns,
        languages: user.languages,
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
        hireDate: volunteer.hireDate,
        dateOfBirth: volunteer.dateOfBirth,
        pronouns: volunteer.pronouns,
        skills: convertToSkillResponseDTO(volunteer.skills),
        branches: convertToBranchResponseDTO(volunteer.branches),
        languages: user.languages,
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
          user: true,
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
            languages: volunteer.user.languages,
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
            languages: volunteerUser.languages,
            emergencyContactName: volunteerUser.emergencyContactName,
            emergencyContactPhone: volunteerUser.emergencyContactPhone,
            emergencyContactEmail: volunteerUser.emergencyContactEmail,
            volunteer: {
              create: {
                hireDate: volunteerUser.hireDate,
                pronouns: volunteerUser.pronouns ?? "",
                dateOfBirth: volunteerUser.dateOfBirth,
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
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          hireDate: volunteer!.hireDate,
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          dateOfBirth: volunteer!.dateOfBirth,
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          pronouns: volunteer!.pronouns,
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
                languages: volunteerUser.languages,
                emergencyContactName: volunteerUser.emergencyContactName,
                emergencyContactPhone: volunteerUser.emergencyContactPhone,
                emergencyContactEmail: volunteerUser.emergencyContactEmail,
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
      } catch (error: unknown) {
        try {
          prisma.volunteer.update({
            where: {
              id: Number(userId),
            },
            data: {
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              hireDate: oldVolunteerUser!.hireDate,
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              pronouns: oldVolunteerUser!.pronouns,
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              dateOfBirth: oldVolunteerUser!.dateOfBirth,
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
              languages: deletedVolunteerUser.languages,
              emergencyContactName: deletedVolunteerUser.emergencyContactName,
              emergencyContactPhone: deletedVolunteerUser.emergencyContactPhone,
              emergencyContactEmail: deletedVolunteerUser.emergencyContactEmail,
              volunteer: {
                create: {
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  hireDate: deletedVolunteer!.hireDate,
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  pronouns: deletedVolunteer!.pronouns ?? "",
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  dateOfBirth: deletedVolunteer!.dateOfBirth ?? "",
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
          user: true,
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
        languages: user.languages,
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        emergencyContactEmail: user.emergencyContactEmail,
        branchId: String(employee.branchId),
        title: employee.title,
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
          employee: true,
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
        languages: user.languages,
        branchId: String(employee.branchId),
        title: employee.title,
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
          user: true,
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
            email: firebaseUser.email ?? "",
            branchId: String(employee.branchId),
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
            role: "EMPLOYEE",
            phoneNumber: employeeUser.phoneNumber,
            emergencyContactName: employeeUser.emergencyContactName,
            emergencyContactPhone: employeeUser.emergencyContactPhone,
            emergencyContactEmail: employeeUser.emergencyContactEmail,
            employee: {
              create: {
                branch: {
                  connect: { id: Number(employeeUser.branchId) },
                },
                title: employeeUser.title,
              },
            },
          },
          include: {
            employee: true,
          },
        });

        const { employee } = newUser;

        return {
          ...newUser,
          id: String(newUser.id),
          email: firebaseUser.email ?? "",
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          branchId: String(employee!.branchId),
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          title: employee!.title,
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
      const [oldEmployeeUser, updatedEmployeeUser] = await prisma.$transaction([
        prisma.employee.findUnique({
          where: {
            id: Number(userId),
          },
          include: {
            user: true,
          },
        }),
        prisma.employee.update({
          where: {
            id: Number(userId),
          },
          data: {
            user: {
              update: {
                firstName: employeeUser.firstName,
                lastName: employeeUser.lastName,
                role: "EMPLOYEE",
                phoneNumber: employeeUser.phoneNumber,
                emergencyContactName: employeeUser.emergencyContactName,
                emergencyContactPhone: employeeUser.emergencyContactPhone,
                emergencyContactEmail: employeeUser.emergencyContactEmail,
              },
            },
            branch: {
              connect: { id: Number(employeeUser.branchId) },
            },
            title: employeeUser.title,
          },
          include: {
            user: true,
          },
        }),
      ]);
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
          branchId: String(updatedEmployeeUser.branchId),
          title: updatedEmployeeUser.title,
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
                },
              },
              branch: {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                connect: { id: Number(oldEmployeeUser!.branchId) },
              },
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              title: oldEmployeeUser!.title,
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
              employee: {
                create: {
                  branch: {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    connect: { id: Number(deletedEmployee!.branchId) },
                  },
                  postings: {
                    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    connect: deletedEmployee!.postings.map((p) => {
                      return { id: Number(p.id) };
                    }),
                  },
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  title: deletedEmployee!.title,
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

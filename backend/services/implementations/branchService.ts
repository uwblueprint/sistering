import * as firebaseAdmin from "firebase-admin";
import { PrismaClient, Branch } from "@prisma/client";
import IBranchService from "../interfaces/branchService";
import { BranchRequestDTO, BranchResponseDTO } from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import convertToNumberIds from "../../utilities/typeUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class BranchService implements IBranchService {
  /* eslint-disable class-methods-use-this */

  async getBranch(branchId: string): Promise<BranchResponseDTO> {
    let branch: Branch | null;

    try {
      branch = await prisma.branch.findUnique({
        where: {
          id: Number(branchId),
        },
      });

      if (!branch) {
        throw new Error(`branchId ${branchId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get branch. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(branch.id),
      name: branch.name,
    };
  }

  async getBranches(): Promise<BranchResponseDTO[]> {
    try {
      const branches: Array<Branch> = await prisma.branch.findMany({
        orderBy: [{ name: "asc" }],
      });
      return branches.map((branch) => ({
        id: String(branch.id),
        name: branch.name,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get branches. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createBranch(branch: BranchRequestDTO): Promise<BranchResponseDTO> {
    let newBranch: Branch | null;
    try {
      if (!branch.name || branch.name.trim() === "") {
        throw new Error(
          "Failed to create branch. Reason = Branch name is required.",
        );
      }
      newBranch = await prisma.branch.create({
        data: {
          name: branch.name,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create branch. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(newBranch.id),
      name: newBranch.name,
    };
  }

  async updateBranch(
    branchId: string,
    branch: BranchRequestDTO,
  ): Promise<BranchResponseDTO | null> {
    let updateResult: Branch | null;
    try {
      if (!branch.name || branch.name.trim() === "") {
        throw new Error(
          "Failed to create branch. Reason = Branch name is required.",
        );
      }
      updateResult = await prisma.branch.update({
        where: { id: Number(branchId) },
        data: {
          name: branch.name,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to update branch. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(updateResult.id),
      name: updateResult.name,
    };
  }

  async deleteBranch(branchId: string): Promise<string> {
    try {
      const deleteResult: Branch | null = await prisma.branch.delete({
        where: { id: Number(branchId) },
      });
      return String(deleteResult.id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete branch. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateUserBranchesByEmail(
    email: string,
    branchIds: string[],
  ): Promise<number> {
    let userId = -1;
    try {
      const firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      const user = await prisma.user.findUnique({
        where: {
          authId: firebaseUser.uid,
        },
        include: {
          employee: true,
          volunteer: true,
        },
      });
      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }
      userId = user.id;

      // Update employee branches
      if (user.employee !== null) {
        await prisma.employee.update({
          where: {
            id: userId,
          },
          data: {
            branches: {
              set: [], // setting the related branches to be [] before connecting the passed in values
              connect: convertToNumberIds(branchIds),
            },
          },
        });
      }
      // Update volunteer branches
      if (user.volunteer !== null) {
        await prisma.volunteer.update({
          where: {
            id: userId,
          },
          data: {
            branches: {
              set: [], // setting the related branches to be [] before connecting the passed in values
              connect: convertToNumberIds(branchIds),
            },
          },
        });
        await prisma.signup.deleteMany({
          where: {
            userId: {
              equals: userId,
            },
            shift: {
              posting: {
                branchId: {
                  notIn: branchIds.map((id) => Number(id)),
                },
              },
            },
          },
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userId;
  }

  async appendBranchesForMultipleUsersByEmail(
    emails: string[],
    branchIds: string[],
  ): Promise<boolean> {
    try {
      emails.forEach(async (email) => {
        const firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
        const user = await prisma.user.findUnique({
          where: {
            authId: firebaseUser.uid,
          },
          include: {
            employee: true,
            volunteer: true,
          },
        });
        if (!user) {
          throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
        }

        // Update employee branches
        if (user.employee !== null) {
          await prisma.employee.update({
            where: {
              id: user.id,
            },
            data: {
              branches: {
                connect: convertToNumberIds(branchIds),
              },
            },
          });
        }
        // Update volunteer branches
        if (user.volunteer !== null) {
          await prisma.volunteer.update({
            where: {
              id: user.id,
            },
            data: {
              branches: {
                connect: convertToNumberIds(branchIds),
              },
            },
          });
        }
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return true;
  }
}

export default BranchService;

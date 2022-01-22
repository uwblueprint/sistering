import { PrismaClient, Branch } from "@prisma/client";
import IBranchService from "../interfaces/branchService";
import { BranchRequestDTO, BranchResponseDTO } from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

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
      const branches: Array<Branch> = await prisma.branch.findMany();
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
}

export default BranchService;

import { PrismaClient, Prerequisite } from "@prisma/client";
import IPrerequisiteService from "../interfaces/IPrerequisiteService";
import { PrerequisiteRequestDTO, PrerequisiteResponseDTO } from "../../types";
import logger from "../../utilities/logger";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class PrerequisiteService implements IPrerequisiteService {
  /* eslint-disable class-methods-use-this */

  async getPrerequisite(prerequisiteId: string): Promise<PrerequisiteResponseDTO> {
    let prerequisite: Prerequisite | null;

    try {
      prerequisite = await prisma.prerequisite.findUnique({
        where: {
          id: Number(prerequisiteId),
        },
      });

      if (!prerequisite) {
        throw new Error(`prerequisiteId ${prerequisiteId} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get prerequisite. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(prerequisite.id),
      name: prerequisite.name,
      completed: prerequisite.completed,
      requiresAdminVerification: prerequisite.requiresAdminVerification,
    };
  }

  async getPrerequisites(): Promise<PrerequisiteResponseDTO[]> {
    try {
      const prerequisites: Array<Prerequisite> = await prisma.prerequisite.findMany();
      return prerequisites.map((prerequisite) => ({
        id: String(prerequisite.id),
        name: prerequisite.name,
        completed: prerequisite.completed,
        requiresAdminVerification: prerequisite.requiresAdminVerification,
      }));
    } catch (error) {
      Logger.error(`Failed to get prerequisites. Reason = ${error.message}`);
      throw error;
    }
  }

  async createPrerequisite(prerequisite: PrerequisiteRequestDTO): Promise<PrerequisiteResponseDTO> {
    let newPrerequisite: Prerequisite | null;
    try {
      newPrerequisite = await prisma.prerequisite.create({
        data: {
          name: prerequisite.name,
          completed: prerequisite.completed,
          requires_admin_verification: prerequisite.requiresAdminVerification,
        },
      });
    } catch (error) {
      Logger.error(`Failed to create prerequisite. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(newPrerequisite.id),
      name: newPrerequisite.name,
      completed: newPrerequisite.completed,
      requiresAdminVerification: newPrerequisite.requiresAdminVerification,
    };
  }

  async updatePrerequisite(
    prerequisiteId: string,
    prerequisite: PrerequisiteRequestDTO,
  ): Promise<PrerequisiteResponseDTO | null> {
    let updateResult: Prerequisite | null;
    try {
      const currentPrerequisite = await prisma.prerequisite.findUnique({
        where: {
          id: Number(prerequisiteId),
        },
      });
      updateResult = await prisma.prerequisite.update({
        where: { id: Number(prerequisiteId) },
        data: {
          name: prerequisite.name,
          completed: prerequisite.completed,
          requires_admin_verification: prerequisite.requiresAdminVerification,
        },
      });

      if (!updateResult) {
        throw new Error(`Prerequisite id ${prerequisiteId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to update prerequisite. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(updateResult.id),
      name: updateResult.name,
      completed: updateResult.completed,
      requiresAdminVerification: updateResult.requiresAdminVerification,
    };
  }

  async deletePrerequisite(prerequisiteId: string): Promise<void> {
    try {
      const prerequisiteToDelete = await prisma.prerequisite.findUnique({
        where: { id: Number(prerequisiteId) },
      });
      const deleteResult: Prerequisite | null = await prisma.prerequisite.delete({
        where: { id: Number(prerequisiteId) },
      });

      if (!prerequisiteToDelete || !deleteResult) {
        throw new Error(`Prerequisite id ${prerequisiteId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete prerequisite. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default PrerequisiteService;

import { PrismaClient, Skill } from "@prisma/client";
import ISkillService from "../interfaces/ISkillService";
import { SkillRequestDTO, SkillResponseDTO } from "../../types";
import logger from "../../utilities/logger";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class SkillService implements ISkillService {
  /* eslint-disable class-methods-use-this */

  async getSkill(skillId: string): Promise<SkillResponseDTO> {
    let skill: Skill | null;

    try {
      skill = await prisma.skill.findUnique({
        where: {
          id: Number(skillId),
        },
      });

      if (!skill) {
        throw new Error(`skillId ${skillId} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get skill. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(skill.id),
      name: skill.name,
    };
  }

  async getSkills(): Promise<SkillResponseDTO[]> {
    try {
      const skills: Array<Skill> = await prisma.skill.findMany();
      return skills.map((skill) => ({
        id: String(skill.id),
        name: skill.name,
        completed: skill.completed,
        requiresAdminVerification: skill.requiresAdminVerification,
      }));
    } catch (error) {
      Logger.error(`Failed to get skills. Reason = ${error.message}`);
      throw error;
    }
  }

  async createSkill(skill: SkillRequestDTO): Promise<SkillResponseDTO> {
    let newSkill: Skill | null;
    try {
      newSkill = await prisma.skill.create({
        data: {
          name: skill.name,
        },
      });
    } catch (error) {
      Logger.error(`Failed to create skill. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(newSkill.id),
      name: newSkill.name,
    };
  }

  async updateSkill(
    skillId: string,
    skill: SkillRequestDTO,
  ): Promise<SkillResponseDTO | null> {
    let updateResult: Skill | null;
    try {
      await prisma.skill.findUnique({
        where: {
          id: Number(skillId),
        },
      });
      updateResult = await prisma.skill.update({
        where: { id: Number(skillId) },
        data: {
          name: skill.name,
        },
      });

      if (!updateResult) {
        throw new Error(`Skill id ${skillId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to update skill. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: String(updateResult.id),
      name: updateResult.name,
    };
  }

  async deleteSkill(skillId: string): Promise<void> {
    try {
      const skillToDelete = await prisma.skill.findUnique({
        where: { id: Number(skillId) },
      });
      const deleteResult: Skill | null = await prisma.skill.delete({
        where: { id: Number(skillId) },
      });

      if (!skillToDelete || !deleteResult) {
        throw new Error(`Skill id ${skillId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete skill. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default SkillService;

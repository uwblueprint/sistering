import { PrismaClient, Skill } from "@prisma/client";
import ISkillService from "../interfaces/skillService";
import { SkillRequestDTO, SkillResponseDTO } from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

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
    } catch (error: unknown) {
      Logger.error(`Failed to get skill. Reason = ${getErrorMessage(error)}`);
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
      }));
    } catch (error: unknown) {
      Logger.error(`Failed to get skills. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createSkill(skill: SkillRequestDTO): Promise<SkillResponseDTO> {
    let newSkill: Skill | null;
    try {
      if (!skill.name || skill.name.trim() === "") {
        throw new Error(
          "Failed to create skill. Reason = Skill name is required.",
        );
      }
      newSkill = await prisma.skill.create({
        data: {
          name: skill.name,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create skill. Reason = ${getErrorMessage(error)}`,
      );
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
      if (!skill.name || skill.name.trim() === "") {
        throw new Error(
          "Failed to create skill. Reason = Skill name is required.",
        );
      }
      updateResult = await prisma.skill.update({
        where: { id: Number(skillId) },
        data: {
          name: skill.name,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to update skill. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(updateResult.id),
      name: updateResult.name,
    };
  }

  async deleteSkill(skillId: string): Promise<string> {
    try {
      const deleteResult: Skill | null = await prisma.skill.delete({
        where: { id: Number(skillId) },
      });
      return String(deleteResult.id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete skill. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default SkillService;

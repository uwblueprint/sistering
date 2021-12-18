import SkillService from "../../services/implementations/skillService";
import ISkillService from "../../services/interfaces/skillService";
import { SkillRequestDTO, SkillResponseDTO } from "../../types";

const skillService: ISkillService = new SkillService();

const skillResolvers = {
  Query: {
    skill: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<SkillResponseDTO> => {
      return skillService.getSkill(id);
    },
    skills: async (): Promise<SkillResponseDTO[]> => {
      return skillService.getSkills();
    },
  },
  Mutation: {
    createSkill: async (
      _parent: undefined,
      { skill }: { skill: SkillRequestDTO },
    ): Promise<SkillResponseDTO> => {
      const newSkill = await skillService.createSkill(skill);
      return newSkill;
    },
    updateSkill: async (
      _parent: undefined,
      { id, skill }: { id: string; skill: SkillRequestDTO },
    ): Promise<SkillResponseDTO | null> => {
      return skillService.updateSkill(id, skill);
    },
    deleteSkill: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return skillService.deleteSkill(id);
    },
  },
};

export default skillResolvers;

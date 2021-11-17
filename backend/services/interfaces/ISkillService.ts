import { SkillRequestDTO, SkillResponseDTO } from "../../types";

interface ISkillService {
  /**
   * Get SkillDTO associated with id
   * @param id skill's id
   * @returns a SkillDTO with skill's information
   * @throws Error if skill retrieval fails
   */
  getSkill(skillId: string): Promise<SkillResponseDTO>;

  /**
   * Get all skill information (possibly paginated in the future)
   * @returns array of SkillDTOs
   * @throws Error if skill retrieval fails
   */
  getSkills(): Promise<SkillResponseDTO[]>;

  /**
   * Create a skill
   * @param skill the skill to be created
   * @returns a SkillDTO with the created skill's information
   * @throws Error if skill creation fails
   */
  createSkill(skill: SkillRequestDTO): Promise<SkillResponseDTO>;

  /**
   * Update a skill.
   * @param skillId skill's id
   * @param skill the skill to be updated
   * @returns a SkillDTO with the updated skill's information
   * @throws Error if skill update fails
   */
  updateSkill(
    skillId: string,
    skill: SkillRequestDTO,
  ): Promise<SkillResponseDTO | null>;

  /**
   * Delete a skill by id
   * @param skillId skill's skillId
   * @throws Error if skill deletion fails
   */
  deleteSkill(skillId: string): Promise<void>;
}

export default ISkillService;

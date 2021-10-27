import {
    PrerequisiteRequestDTO,
    PrerequisiteResponseDTO,
  } from "../../types";
  
  interface IPrerequisiteService {
    /**
     * Get prerequisiteDTO associated with id
     * @param id prerequisite's id
     * @returns a prerequisiteDTO with prerequisite's information
     * @throws Error if prerequisite retrieval fails
     */
    getPrerequisite(prerequisiteId: string): Promise<PrerequisiteResponseDTO>;
    
    /**
     * Get all prerequisite information (possibly paginated in the future)
     * @returns array of PrerequisiteDTOs
     * @throws Error if prerequisite retrieval fails
     */
    getPrerequisites(): Promise<PrerequisiteResponseDTO[]>;
  
    /**
     * Create a prerequisite
     * @param prerequisite the prerequisite to be created
     * @returns a PrerequisiteDTO with the created prerequisite's information
     * @throws Error if prerequisite creation fails
     */
    createPrerequisite(prerequisite: PrerequisiteRequestDTO): Promise<PrerequisiteResponseDTO>;
  
    /**
     * Update a prerequisite.
     * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
     * @param prerequisiteId prerequisite's id
     * @param prerequisite the prerequisite to be updated
     * @returns a PrerequisiteDTO with the updated prerequisite's information
     * @throws Error if prerequisite update fails
     */
    updatePrerequisite(prerequisiteId: string, prerequisite: PrerequisiteRequestDTO): Promise<PrerequisiteResponseDTO| null>;
  
    /**
     * Delete a prerequisite by id
     * @param prerequisiteId prerequisite's prerequisiteId
     * @throws Error if prerequisite deletion fails
     */
    deletePrerequisite(prerequisiteId: string): Promise<void>;
  }
  
  export default IPrerequisiteService;
  
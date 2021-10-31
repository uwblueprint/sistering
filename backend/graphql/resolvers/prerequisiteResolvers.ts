import PrerequisiteService from "../../services/implementations/prerequisiteService";
import IPrerequisiteService from "../../services/interfaces/IPrerequisiteService";
import { PrerequisiteRequestDTO, PrerequisiteResponseDTO } from "../../types";

const prerequisiteService: IPrerequisiteService = new PrerequisiteService();

const prerequisiteResolvers = {
  Query: {
    prerequisite: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<PrerequisiteResponseDTO> => {
      return prerequisiteService.getPrerequisite(id);
    },
    prerequisites: async (): Promise<PrerequisiteResponseDTO[]> => {
      return prerequisiteService.getPrerequisites();
    },
  },
  Mutation: {
    createPrerequisite: async (
      _parent: undefined,
      { prerequisite }: { prerequisite: PrerequisiteRequestDTO },
    ): Promise<PrerequisiteResponseDTO> => {
      const newPrerequisite = await prerequisiteService.createPrerequisite(
        prerequisite,
      );
      return newPrerequisite;
    },
    updatePrerequisite: async (
      _parent: undefined,
      {
        id,
        prerequisite,
      }: { id: string; prerequisite: PrerequisiteRequestDTO },
    ): Promise<PrerequisiteResponseDTO | null> => {
      return prerequisiteService.updatePrerequisite(id, prerequisite);
    },
    deletePrerequisite: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<void> => {
      return prerequisiteService.deletePrerequisite(id);
    },
  },
};

export default prerequisiteResolvers;

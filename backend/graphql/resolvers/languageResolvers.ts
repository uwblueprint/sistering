import LanguageService from "../../services/implementations/languageService";
import ILanguageService from "../../services/interfaces/languageService";
import { LanguageRequestDTO, LanguageResponseDTO } from "../../types";

const languageService: ILanguageService = new LanguageService();

const languageResolvers = {
  Query: {
    language: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<LanguageResponseDTO> => {
      return languageService.getLanguage(id);
    },
    languages: async (): Promise<LanguageResponseDTO[]> => {
      return languageService.getLanguages();
    },
  },
  Mutation: {
    createLanguage: async (
      _parent: undefined,
      { language }: { language: LanguageRequestDTO },
    ): Promise<LanguageResponseDTO> => {
      const newLanguage = await languageService.createLanguage(language);
      return newLanguage;
    },
    updateLanguage: async (
      _parent: undefined,
      { id, language }: { id: string; language: LanguageRequestDTO },
    ): Promise<LanguageResponseDTO | null> => {
      return languageService.updateLanguage(id, language);
    },
    deleteLanguage: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return languageService.deleteLanguage(id);
    },
  },
};

export default languageResolvers;

import { PrismaClient, Language } from "@prisma/client";
import ILanguageService from "../interfaces/languageService";
import { LanguageRequestDTO, LanguageResponseDTO } from "../../types";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const prisma = new PrismaClient();

const Logger = logger(__filename);

class LanguageService implements ILanguageService {
  /* eslint-disable class-methods-use-this */

  async getLanguage(languageId: string): Promise<LanguageResponseDTO> {
    let language: Language | null;

    try {
      language = await prisma.language.findUnique({
        where: {
          id: Number(languageId),
        },
      });

      if (!language) {
        throw new Error(`languageId ${languageId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to get language. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: String(language.id),
      name: language.name,
    };
  }

  async getLanguages(): Promise<LanguageResponseDTO[]> {
    try {
      const languages: Array<Language> = await prisma.language.findMany({
        orderBy: [{ name: "asc" }],
      });
      return languages.map((language) => ({
        id: String(language.id),
        name: language.name,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get languages. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createLanguage(
    language: LanguageRequestDTO,
  ): Promise<LanguageResponseDTO> {
    let newLanguage: Language | null;
    try {
      if (!language.name || language.name.trim() === "") {
        throw new Error(
          "Failed to create language. Reason = Language name is required.",
        );
      }
      newLanguage = await prisma.language.create({
        data: {
          name: language.name,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create language. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(newLanguage.id),
      name: newLanguage.name,
    };
  }

  async updateLanguage(
    languageId: string,
    language: LanguageRequestDTO,
  ): Promise<LanguageResponseDTO | null> {
    let updateResult: Language | null;
    try {
      if (!language.name || language.name.trim() === "") {
        throw new Error(
          "Failed to create language. Reason = Language name is required.",
        );
      }
      updateResult = await prisma.language.update({
        where: { id: Number(languageId) },
        data: {
          name: language.name,
        },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to update language. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(updateResult.id),
      name: updateResult.name,
    };
  }

  async deleteLanguage(languageId: string): Promise<string> {
    try {
      const deleteResult: Language | null = await prisma.language.delete({
        where: { id: Number(languageId) },
      });
      return String(deleteResult.id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete language. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default LanguageService;

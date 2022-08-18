import { LanguageRequestDTO, LanguageResponseDTO } from "../../types";

interface ILanguageService {
  /**
   * Get LanguageDTO associated with id
   * @param id language's id
   * @returns a LanguageDTO with language's information
   * @throws Error if language retrieval fails
   */
  getLanguage(languageId: string): Promise<LanguageResponseDTO>;

  /**
   * Get all language information (possibly paginated in the future)
   * @returns array of LanguageDTOs
   * @throws Error if language retrieval fails
   */
  getLanguages(): Promise<LanguageResponseDTO[]>;

  /**
   * Create a language
   * @param language the language to be created
   * @returns a LanguageDTO with the created language's information
   * @throws Error if language creation fails
   */
  createLanguage(language: LanguageRequestDTO): Promise<LanguageResponseDTO>;

  /**
   * Update a language.
   * @param languageId language's id
   * @param language the language to be updated
   * @returns a LanguageDTO with the updated language's information
   * @throws Error if language update fails
   */
  updateLanguage(
    languageId: string,
    language: LanguageRequestDTO,
  ): Promise<LanguageResponseDTO | null>;

  /**
   * Delete a language by id
   * @param languageId language's languageId
   * @throws Error if language deletion fails
   */
  deleteLanguage(languageId: string): Promise<string>;
}

export default ILanguageService;

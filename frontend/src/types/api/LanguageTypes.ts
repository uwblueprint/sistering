export type LanguageDTO = {
  id: string;
  name: string;
};

export type LanguageRequestDTO = Omit<LanguageDTO, "id">;

export type LanguageResponseDTO = LanguageDTO;

export type LanguageQueryResponse = {
  languages: LanguageResponseDTO[];
};

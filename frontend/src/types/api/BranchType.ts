export type BranchDTO = {
    id: string;
    name: string;
  };
  
  export type BranchRequestDTO = Omit<BranchDTO, "id">;
  
  export type BranchResponseDTO = BranchDTO;
  
import BranchService from "../../services/implementations/branchService";
import IBranchService from "../../services/interfaces/branchService";
import { BranchRequestDTO, BranchResponseDTO } from "../../types";

const branchService: IBranchService = new BranchService();

const branchResolvers = {
  Query: {
    branch: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<BranchResponseDTO> => {
      return branchService.getBranch(id);
    },
    branches: async (): Promise<BranchResponseDTO[]> => {
      return branchService.getBranches();
    },
  },
  Mutation: {
    createBranch: async (
      _parent: undefined,
      { branch }: { branch: BranchRequestDTO },
    ): Promise<BranchResponseDTO> => {
      const newBranch = await branchService.createBranch(branch);
      return newBranch;
    },
    updateBranch: async (
      _parent: undefined,
      { id, branch }: { id: string; branch: BranchRequestDTO },
    ): Promise<BranchResponseDTO | null> => {
      return branchService.updateBranch(id, branch);
    },
    deleteBranch: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return branchService.deleteBranch(id);
    },
  },
};

export default branchResolvers;

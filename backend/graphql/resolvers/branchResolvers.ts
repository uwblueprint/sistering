import { ExpressContext } from "apollo-server-express";
import BranchService from "../../services/implementations/branchService";
import UserService from "../../services/implementations/userService";
import IBranchService from "../../services/interfaces/branchService";
import IUserService from "../../services/interfaces/userService";
import { BranchRequestDTO, BranchResponseDTO } from "../../types";

const userService: IUserService = new UserService();
const branchService: IBranchService = new BranchService(userService);

const branchResolvers = {
  Query: {
    branch: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<BranchResponseDTO> => {
      return branchService.getBranch(id);
    },
    branches: async (
      _parent: undefined,
      _args: undefined,
      context: ExpressContext,
    ): Promise<BranchResponseDTO[]> => {
      return branchService.getBranches(context);
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
    updateUserBranchesByEmail: async (
      _parent: undefined,
      { email, branchIds }: { email: string; branchIds: string[] },
    ): Promise<number> => {
      return branchService.updateUserBranchesByEmail(email, branchIds);
    },
    appendBranchesForMultipleUsersByEmail: async (
      _parent: undefined,
      { emails, branchIds }: { emails: string[]; branchIds: string[] },
    ): Promise<boolean> => {
      return branchService.appendBranchesForMultipleUsersByEmail(
        emails,
        branchIds,
      );
    },
  },
};

export default branchResolvers;

import { BranchRequestDTO, BranchResponseDTO } from "../../types";

interface IBranchService {
  /**
   * Get BranchDTO associated with id
   * @param id branch's id
   * @returns a BranchDTO with branch's information
   * @throws Error if branch retrieval fails
   */
  getBranch(branchId: string): Promise<BranchResponseDTO>;

  /**
   * Get all branch information (possibly paginated in the future)
   * @returns array of BranchDTOs
   * @throws Error if branch retrieval fails
   */
  getBranches(): Promise<BranchResponseDTO[]>;

  /**
   * Create a branch
   * @param branch the branch to be created
   * @returns a BranchDTO with the created branch's information
   * @throws Error if branch creation fails
   */
  createBranch(branch: BranchRequestDTO): Promise<BranchResponseDTO>;

  /**
   * Update a branch.
   * @param branchId branch's id
   * @param branch the branch to be updated
   * @returns a BranchDTO with the updated branch's information
   * @throws Error if branch update fails
   */
  updateBranch(
    branchId: string,
    branch: BranchRequestDTO,
  ): Promise<BranchResponseDTO | null>;

  /**
   * Delete a branch by id
   * @param branchId branch's branchId
   * @throws Error if branch deletion fails
   */
  deleteBranch(branchId: string): Promise<string>;

  /**
   * Update branches of a user by their email.
   * @param email user's email
   * @param branchIds the new branches associated with the user
   * @returns id of updated user
   * @throws Error if branch update fails
   */
  updateUserBranchesByEmail(
    email: string,
    branchIds: string[],
  ): Promise<number>;

  /**
   * Append branches of multiple users by their email.
   * @param emails users' email
   * @param branchIds the new branches to add for the users
   * @returns whether operation successful
   * @throws Error if branch update fails
   */
  appendBranchesForMultipleUsersByEmail(
    emails: string[],
    branchIds: string[],
  ): Promise<boolean>;
}

export default IBranchService;

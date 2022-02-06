import {
  CreateShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
} from "../../types";

interface IShiftSignupService {
  /**
   * Bulk creates sign ups for shifts
   * @param shiftSignups array of CreateShiftSignupDTOs
   * @returns an array of ShiftSignupResponseDTO
   * @throws Error if any of the shifts signups cannot be created
   */
  createShiftSignups(
    shiftSignups: CreateShiftSignupDTO[],
  ): Promise<ShiftSignupResponseDTO[]>;

  /**
   * Update a shift signup entry
   * @param shiftId the shift to update
   * @param userId the user to update
   * @param shiftSignup the information to be updated
   * @returns a ShiftSignupResponseDTO containing the updated information
   * @throws Error if the shift signup
   */
  updateShiftSignup(
    shiftId: string,
    userId: string,
    shiftSignup: UpdateShiftSignupRequestDTO,
  ): Promise<ShiftSignupResponseDTO>;

  /**
   * Gets all shifts the user has signed up for
   * @param userId the target user's id
   * @returns an array of ShiftSignupResponseDTOs for each shift the user signed up for
   * @throws Error if the shift signup retrieval fails
   */
  getShiftSignupsForUser(userId: string): Promise<ShiftSignupResponseDTO[]>;
}

export default IShiftSignupService;
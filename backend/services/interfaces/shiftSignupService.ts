import { SignupStatus } from "@prisma/client";
import {
  CreateShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpdateShiftSignupRequestDTO,
  UpsertDeleteShiftSignupsRequestDTO,
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
   * Bulk upsert and delete sign ups for shifts
   * @param upsertDeleteshiftSignups array of UpsertShiftSignupDTOs and DeleteShiftSignupDTOs
   * @returns an array of ShiftSignupResponseDTO
   * @throws Error if any of the shifts signups cannot be created
   */
  upsertDeleteShiftSignups(
    upsertDeleteShiftSignups: UpsertDeleteShiftSignupsRequestDTO,
  ): Promise<ShiftSignupResponseDTO[]>;

  /**
   * Gets all shifts the user has signed up for
   * @param userId the target user's id
   * @returns an array of ShiftSignupResponseDTOs for each shift the user signed up for
   * @throws Error if the shift signup retrieval fails
   */
  getShiftSignupsForUser(
    userId: string,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftSignupResponseDTO[]>;

  /**
   * Gets all shifts for a posting
   * @param postingId the target posting's id
   * @returns an array of ShiftSignupResponseDTOs for each shift for posting
   * @throws Error if the shift signup retrieval fails
   */
  getShiftSignupsForPosting(
    postingId: string,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftSignupResponseDTO[]>;
}

export default IShiftSignupService;

import { SignupStatus } from "@prisma/client";
import {
  DeleteShiftSignupDTO,
  ShiftSignupResponseDTO,
  UpsertShiftSignupDTO,
} from "../../types";

interface IShiftSignupService {
  /**
   * Bulk upsert and delete sign ups for shifts
   * @param upsertShiftSignups array of UpsertShiftSignupDTOs for request
   * @param deleteShiftSignups array of DeleteShiftSignupDTOs for request
   * @returns an array of ShiftSignupResponseDTO
   * @throws Error if any of the shifts signups cannot be created
   */
  upsertDeleteShiftSignups(
    upsertShiftSignups: UpsertShiftSignupDTO[],
    deleteShiftSignups: DeleteShiftSignupDTO[],
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

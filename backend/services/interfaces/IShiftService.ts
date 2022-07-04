import { SignupStatus } from "@prisma/client";
import {
  ShiftBulkRequestDTO,
  ShiftBulkRequestWithoutPostingId,
  ShiftRequestDTO,
  ShiftResponseDTO,
  ShiftWithSignupAndVolunteerResponseDTO,
  TimeBlock,
} from "../../types";

interface IShiftService {
  /**
   * Generate shift data in bulk
   * @param shifts the shifts to be created
   * @returns an array of TimeBlocks
   * @throws Error if shift validation fails
   */
  bulkGenerateTimeBlocks(shifts: ShiftBulkRequestWithoutPostingId): TimeBlock[];
  /**
   * Get ShiftDTO associated with id
   * @param id shift's id
   * @returns a ShiftDTO with shift's information
   * @throws Error if shift retrieval fails
   */
  getShift(shiftId: string): Promise<ShiftResponseDTO>;

  /**
   * Get all shift information (possibly paginated in the future)
   * @returns array of ShiftDTOs
   * @throws Error if shift retrieval fails
   */
  getShifts(): Promise<ShiftResponseDTO[]>;

  /**
   * Get all shift information (possibly paginated in the future) of a posting
   * @param postingId the id of the posting associated with the shifts
   * @returns array of ShiftDTOs for posting
   * @throws Error if shift retrieval fails
   */
  getShiftsByPosting(postingId: string): Promise<ShiftResponseDTO[]>;

  /**
   * Gets all shift, signup and volunteer info for a given posting id, user
   * id, and signup status
   * @param postingId the target posting's id
   * @param userId the target userids for the posting
   * @param signupStatus the target signup status
   * @returns an array of ShiftSignupWithVolunteerResponseDTO for each signup in the posting
   * @throws Error if the shift retrieval fails
   * TODO: Make sure the throws is correct
   */
  getShiftsWithSignupAndVolunteerForPosting(
    postingId: string,
    userId: string | null,
    signupStatus: SignupStatus | null,
  ): Promise<ShiftWithSignupAndVolunteerResponseDTO[]>;

  /**
   * Create a shift
   * @param shift the shift to be created
   * @param postingId the id of the posting associated with the shift
   * @returns a ShiftDTO with the created shift's information
   * @throws Error if shift creation fails
   */
  createShift(shift: TimeBlock, postingId: string): Promise<ShiftResponseDTO>;

  /**
   * Create shifts by bulk
   * @param shifts the shifts to be created
   * @returns a ShiftDTO with the created shifts's information
   * @throws Error if shifts creation fails
   */
  createShifts(shifts: ShiftBulkRequestDTO): Promise<ShiftResponseDTO[]>;

  /**
   * Update a shift.
   * @param shiftId shift's id
   * @param shift the shift to be updated
   * @returns a ShiftDTO with the updated shift's information
   * @throws Error if shift update fails
   */
  updateShift(
    shiftId: string,
    shift: ShiftRequestDTO,
  ): Promise<ShiftResponseDTO | null>;

  /**
   * Update shifts of a posting.
   * @param postingId shift's posting's id
   * @param shifts the shifts to be updated
   * @returns a ShiftDTO with the updated shift's information
   * @throws Error if shift update fails
   */
  updateShifts(
    postingId: string,
    shifts: ShiftBulkRequestDTO,
  ): Promise<ShiftResponseDTO[] | null>;

  /**
   * Delete a shift by id
   * @param shiftId shift's shiftId
   * @throws Error if shift deletion fails
   */
  deleteShift(shiftId: string): Promise<string>;

  /**
   * Delete shifts by postingId
   * @param postingId shift's postingId
   * @throws Error if shift deletion fails
   */
  deleteShifts(postingId: string): Promise<string>;
}

export default IShiftService;

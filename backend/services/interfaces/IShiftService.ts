import { DurationInputArg1, DurationInputArg2 } from "moment";
import {
  BulkShiftRequestDTO,
  RecurrenceInterval,
  ShiftRequestDTO,
  ShiftResponseDTO,
  TimeBlockDTO,
} from "../../types";

export type DurationArgs = {
  value: DurationInputArg1;
  unit: DurationInputArg2;
};

interface IShiftService {
  /**
   * Get moment.js method parameters using recurrence interval
   * @param recurrence a recurrence interval
   * @returns value & unit of time
   */
  getDuration(recurrence: RecurrenceInterval): DurationArgs;

  /**
   * Validate a TimeBlockDTO array to ensure that
   * - All dates, startTimes, and endTimes are defined
   * - All startTimes are before endTimes
   * - All dates occur in a span of a week
   * @param timeBlocks a TimeBlockDTO array
   * @returns true if valid, false otherwise
   */
  validateTimeBlocks(timeBlocks: TimeBlockDTO[]): boolean;
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
   * Create a shift
   * @param shifts the shifts to be created
   * @returns a ShiftDTO with the created shifts's information
   * @throws Error if shifts creation fails
   */
  createShifts(shifts: BulkShiftRequestDTO): Promise<ShiftResponseDTO[]>;

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
    shifts: BulkShiftRequestDTO,
  ): Promise<ShiftResponseDTO[] | null>;

  /**
   * Delete a shift by id
   * @param shiftId shift's shiftId
   * @throws Error if shift deletion fails
   */
  deleteShift(shiftId: string): Promise<void>;

  /**
   * Delete shifts by postingId
   * @param postingId shift's postingId
   * @throws Error if shift deletion fails
   */
  deleteShifts(postingId: string): Promise<void>;
}

export default IShiftService;

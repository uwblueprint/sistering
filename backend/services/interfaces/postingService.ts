import {
  PostingResponseDTO,
  PostingWithShiftsRequestDTO,
  PostingStatus,
} from "../../types";

interface IPostingService {
  /**
   * Get postingDTO associated with id
   * @param id posting's id
   * @returns a postingDTO with posting's information
   * @throws Error if posting retrieval fails
   */
  getPosting(postingId: string, userId?: string): Promise<PostingResponseDTO>;

  /**
   * Get all posting information (possibly paginated in the future) filtered by optional parameters
   * @param closingDate posting's autoClosingDate must be strictly after closingDate
   * @param statuses posting's status is one of the statuses supplied in statuses
   * @param userId posting's branch is one of the branches the user (as indicated by userId param) is assigned to
   * @returns array of PostingDTOs
   * @throws Error if posting retrieval fails
   */
  getPostings(
    closingDate?: Date,
    statuses?: PostingStatus[],
    userId?: string,
  ): Promise<PostingResponseDTO[]>;

  /**
   * Create a posting
   * @param posting the posting to be created
   * @returns a PostingDTO with the created posting's information
   * @throws Error if posting creation fails
   */
  createPosting(
    posting: PostingWithShiftsRequestDTO,
  ): Promise<PostingResponseDTO>;

  /**
   * Update a posting.
   * @param postingId posting's id
   * @param posting the posting to be updated
   * @returns a PostingDTO with the updated posting's information
   * @throws Error if posting update fails
   */
  updatePosting(
    postingId: string,
    posting: PostingWithShiftsRequestDTO,
  ): Promise<PostingResponseDTO | null>;

  /**
   * Delete a posting by id
   * @param postingId posting's postingId
   * @throws Error if posting deletion fails
   */
  deletePosting(postingId: string): Promise<string>;

  /**
   * Duplicate a posting along with its shifts by id
   * @param postingId posting's postingId
   * @throws Error if posting duplication fails
   */
  duplicatePosting(postingId: string): Promise<string>;
}

export default IPostingService;

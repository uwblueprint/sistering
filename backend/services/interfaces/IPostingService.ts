import { PostingRequestDTO, PostingResponseDTO } from "../../types";

interface IPostingService {
  /**
   * Get postingDTO associated with id
   * @param id posting's id
   * @returns a postingDTO with posting's information
   * @throws Error if posting retrieval fails
   */
  getPosting(postingId: string): Promise<PostingResponseDTO>;

  /**
   * Get all posting information (possibly paginated in the future)
   * @returns array of PostingDTOs
   * @throws Error if posting retrieval fails
   */
  getPostings(): Promise<PostingResponseDTO[]>;

  /**
   * Create a posting
   * @param posting the posting to be created
   * @returns a PostingDTO with the created posting's information
   * @throws Error if posting creation fails
   */
  createPosting(posting: PostingRequestDTO): Promise<PostingResponseDTO>;

  /**
   * Update a posting.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param postingId posting's id
   * @param posting the posting to be updated
   * @returns a PostingDTO with the updated posting's information
   * @throws Error if posting update fails
   */
  updatePosting(
    postingId: string,
    posting: PostingRequestDTO,
  ): Promise<PostingResponseDTO | null>;

  /**
   * Delete a posting by id
   * @param postingId posting's postingId
   * @throws Error if posting deletion fails
   */
  deletePosting(postingId: string): Promise<string>;
}

export default IPostingService;

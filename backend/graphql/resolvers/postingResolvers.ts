import PostingService from "../../services/implementations/postingService";
import IPostingService from "../../services/interfaces/IPostingService";
import { PostingRequestDTO, PostingResponseDTO } from "../../types";

const postingService: IPostingService = new PostingService();

const postingResolvers = {
  Query: {
    posting: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<PostingResponseDTO> => {
      return postingService.getPosting(id);
    },
    postings: async (): Promise<PostingResponseDTO[]> => {
      return postingService.getPostings();
    },
  },
  Mutation: {
    createPosting: async (
      _parent: undefined,
      { posting }: { posting: PostingRequestDTO },
    ): Promise<PostingResponseDTO> => {
      const newPosting = await postingService.createPosting(posting);
      return newPosting;
    },
    updatePosting: async (
      _parent: undefined,
      { id, posting }: { id: string; posting: PostingRequestDTO },
    ): Promise<PostingResponseDTO | null> => {
      return postingService.updatePosting(id, posting);
    },
    deletePosting: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<void> => {
      return postingService.deletePosting(id);
    },
  },
};

export default postingResolvers;

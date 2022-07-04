import PostingService from "../../services/implementations/postingService";
import IPostingService from "../../services/interfaces/postingService";
import IShiftService from "../../services/interfaces/IShiftService";
import ShiftService from "../../services/implementations/shiftService";
import UserService from "../../services/implementations/userService";
import IUserService from "../../services/interfaces/userService";
import {
  PostingResponseDTO,
  PostingWithShiftsRequestDTO,
  PostingStatus,
} from "../../types";

const userService: IUserService = new UserService();
const shiftService: IShiftService = new ShiftService();
const postingService: IPostingService = new PostingService(
  userService,
  shiftService,
);

const postingResolvers = {
  Query: {
    posting: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<PostingResponseDTO> => {
      return postingService.getPosting(id);
    },
    postings: async (
      _parent: undefined,
      {
        closingDate,
        statuses,
        userId,
      }: {
        closingDate?: Date;
        statuses?: PostingStatus[];
        userId?: string;
      } = {},
    ): Promise<PostingResponseDTO[]> => {
      return postingService.getPostings(closingDate, statuses, userId);
    },
  },
  Mutation: {
    createPosting: async (
      _parent: undefined,
      { posting }: { posting: PostingWithShiftsRequestDTO },
    ): Promise<PostingResponseDTO> => {
      const newPosting = await postingService.createPosting(posting);
      return newPosting;
    },
    updatePosting: async (
      _parent: undefined,
      { id, posting }: { id: string; posting: PostingWithShiftsRequestDTO },
    ): Promise<PostingResponseDTO | null> => {
      return postingService.updatePosting(id, posting);
    },
    deletePosting: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return postingService.deletePosting(id);
    },
  },
};

export default postingResolvers;

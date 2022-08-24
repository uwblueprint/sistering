import { ExpressContext } from "apollo-server-express";
import PostingService from "../../services/implementations/postingService";
import IPostingService from "../../services/interfaces/postingService";
import IShiftService from "../../services/interfaces/shiftService";
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
      context: ExpressContext,
    ): Promise<PostingResponseDTO> => {
      return postingService.getPosting(id, context);
    },
    postings: async (
      _parent: undefined,
      {
        closingDate,
        statuses,
      }: {
        closingDate?: Date;
        statuses?: PostingStatus[];
      } = {},
      context: ExpressContext,
    ): Promise<PostingResponseDTO[]> => {
      return postingService.getPostings(context, closingDate, statuses);
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
    duplicatePosting: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return postingService.duplicatePosting(id);
    },
  },
};

export default postingResolvers;

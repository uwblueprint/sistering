import { createContext } from "react";
import { PostingContextType } from "../../types/PostingContextTypes";
import {
  PostingStatus,
  PostingType,
  RecurrenceInterval,
} from "../../types/PostingTypes";

export const DEFAULT_POSTING_CONTEXT = {
  branchId: "",
  skills: [],
  employees: [],
  title: "",
  type: "INDIVIDUAL" as PostingType,
  status: "PUBLISHED" as PostingStatus,
  description: "",
  startDate: "",
  endDate: "",
  autoClosingDate: "",
  numVolunteers: 0,
  times: [
    {
      startTime: "2022-02-06T09:30",
      endTime: "2022-02-06T13:30",
    },
  ],
  recurrenceInterval: "NONE" as RecurrenceInterval,
};

const PostingContext = createContext<PostingContextType>(
  DEFAULT_POSTING_CONTEXT,
);

export default PostingContext;

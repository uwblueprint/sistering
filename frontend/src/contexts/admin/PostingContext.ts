import { createContext } from "react";
import { PostingContextType } from "../../types/PostingContextTypes";
import { PostingStatus, PostingType } from "../../types/PostingTypes";

export const DEFAULT_POSTING_CONTEXT = {
  branch: { id: "", name: "" },
  skills: [],
  employees: [],
  title: "",
  type: "INDIVIDUAL" as PostingType,
  status: "PUBLISHED" as PostingStatus,
  description: "",
  startDate: "",
  endDate: "",
  autoClosingDate: "",
  numVolunteers: 1,
  times: [
    {
      startTime: "2022-02-06T09:30",
      endTime: "2022-02-06T13:30",
    },
  ],
  recurrenceInterval: "" as const,
};

const PostingContext = createContext<PostingContextType>(
  DEFAULT_POSTING_CONTEXT,
);

export default PostingContext;

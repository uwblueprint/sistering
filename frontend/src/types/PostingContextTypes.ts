import { PostingStatus, PostingType, RecurrenceInterval } from "./PostingTypes";

type Shift = {
  startTime: string;
  endTime: string;
};

export type PostingContextType = {
  branchId: string;
  skills: string[];
  employees: string[];
  title: string;
  type: PostingType;
  status: PostingStatus;
  description: string;
  startDate: string;
  endDate: string;
  autoClosingDate: string;
  numVolunteers: number;
  times: Shift[];
  recurrenceInterval: RecurrenceInterval;
};

export type PostingContextAction =
  | {
      type: "ADMIN_POSTING_EDIT_BRANCH_ID";
      value: string;
    }
  | {
      type: "ADMIN_POSTING_EDIT_SKILLS";
      value: string[];
    }
  | {
      type: "ADMIN_POSTING_EDIT_EMPLOYEES";
      value: string[];
    }
  | {
      type: "ADMIN_POSTING_EDIT_TITLE";
      value: string;
    }
  | {
      type: "ADMIN_POSTING_EDIT_TYPE";
      value: PostingType;
    }
  | {
      type: "ADMIN_POSTING_EDIT_STATUS";
      value: PostingStatus;
    }
  | {
      type: "ADMIN_POSTING_EDIT_DESCRIPTION";
      value: string;
    }
  | {
      type: "ADMIN_POSTING_EDIT_START_DATE";
      value: string;
    }
  | {
      type: "ADMIN_POSTING_EDIT_END_DATE";
      value: string;
    }
  | {
      type: "ADMIN_POSTING_EDIT_AUTO_CLOSING_DATE";
      value: string;
    }
  | {
      type: "ADMIN_POSTING_EDIT_NUM_VOLUNTEERS";
      value: number;
    }
  | {
      type: "ADMIN_POSTING_EDIT_TIMES";
      value: Shift[];
    }
  | {
      type: "ADMIN_POSTING_EDIT_RECURRENCE_INTERVAL";
      value: RecurrenceInterval;
    };

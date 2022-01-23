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
      type: "EDIT_BRANCH_ID";
      value: string;
    }
  | {
      type: "EDIT_SKILLS";
      value: string[];
    }
  | {
      type: "EDIT_EMPLOYEES";
      value: string[];
    }
  | {
      type: "EDIT_TITLE";
      value: string;
    }
  | {
      type: "EDIT_TYPE";
      value: PostingType;
    }
  | {
      type: "EDIT_STATUS";
      value: PostingStatus;
    }
  | {
      type: "EDIT_DESCRIPTION";
      value: string;
    }
  | {
      type: "EDIT_START_DATE";
      value: string;
    }
  | {
      type: "EDIT_END_DATE";
      value: string;
    }
  | {
      type: "EDIT_AUTO_CLOSING_DATE";
      value: string;
    }
  | {
      type: "EDIT_NUM_VOLUNTEERS";
      value: number;
    }
  | {
      type: "EDIT_TIMES";
      value: Shift[];
    }
  | {
      type: "EDIT_RECURRENCE_INTERVAL";
      value: RecurrenceInterval;
    };

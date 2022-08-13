import { DEFAULT_POSTING_CONTEXT } from "../contexts/admin/PostingContext";
import {
  PostingContextAction,
  PostingContextType,
} from "../types/PostingContextTypes";

// TODO: use immer to build reducer
export default (
  state: PostingContextType,
  action: PostingContextAction,
): PostingContextType => {
  switch (action.type) {
    case "ADMIN_POSTING_EDIT_BRANCH":
      return {
        ...state,
        branch: { ...action.value },
      };
    case "ADMIN_POSTING_EDIT_SKILLS":
      return {
        ...state,
        skills: action.value.map((v) => ({ ...v })),
      };
    case "ADMIN_POSTING_EDIT_EMPLOYEES":
      return {
        ...state,
        employees: action.value.map((v) => ({ ...v })),
      };
    case "ADMIN_POSTING_EDIT_TITLE":
      return {
        ...state,
        title: action.value,
      };
    case "ADMIN_POSTING_EDIT_TYPE":
      return {
        ...state,
        type: action.value,
      };
    case "ADMIN_POSTING_EDIT_STATUS":
      return {
        ...state,
        status: action.value,
      };
    case "ADMIN_POSTING_EDIT_DESCRIPTION":
      return {
        ...state,
        description: action.value,
      };
    case "ADMIN_POSTING_EDIT_START_DATE":
      return {
        ...state,
        startDate: action.value,
      };
    case "ADMIN_POSTING_EDIT_END_DATE":
      return {
        ...state,
        endDate: action.value,
      };
    case "ADMIN_POSTING_EDIT_AUTO_CLOSING_DATE":
      return {
        ...state,
        autoClosingDate: action.value,
      };
    case "ADMIN_POSTING_EDIT_NUM_VOLUNTEERS":
      return {
        ...state,
        numVolunteers: action.value,
      };
    case "ADMIN_POSTING_EDIT_TIMES":
      return {
        ...state,
        times: action.value,
      };
    case "ADMIN_POSTING_EDIT_RECURRENCE_INTERVAL":
      return {
        ...state,
        recurrenceInterval: action.value,
      };
    case "ADMIN_POSTING_RESET":
      return {
        ...DEFAULT_POSTING_CONTEXT,
      };
    default:
      return state;
  }
};

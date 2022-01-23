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
    case "EDIT_BRANCH_ID":
      return {
        ...state,
        branchId: action.value,
      };
    case "EDIT_SKILLS":
      return {
        ...state,
        skills: action.value,
      };
    case "EDIT_EMPLOYEES":
      return {
        ...state,
        employees: action.value,
      };
    case "EDIT_TITLE":
      return {
        ...state,
        title: action.value,
      };
    case "EDIT_TYPE":
      return {
        ...state,
        type: action.value,
      };
    case "EDIT_STATUS":
      return {
        ...state,
        status: action.value,
      };
    case "EDIT_DESCRIPTION":
      return {
        ...state,
        description: action.value,
      };
    case "EDIT_START_DATE":
      return {
        ...state,
        startDate: action.value,
      };
    case "EDIT_END_DATE":
      return {
        ...state,
        endDate: action.value,
      };
    case "EDIT_AUTO_CLOSING_DATE":
      return {
        ...state,
        autoClosingDate: action.value,
      };
    case "EDIT_NUM_VOLUNTEERS":
      return {
        ...state,
        numVolunteers: action.value,
      };
    case "EDIT_TIMES":
      return {
        ...state,
        times: action.value,
      };
    case "EDIT_RECURRENCE_INTERVAL":
      return {
        ...state,
        recurrenceInterval: action.value,
      };
    default:
      return state;
  }
};

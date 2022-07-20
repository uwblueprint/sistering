import { ShiftSignupStatus } from "../types/api/ShiftSignupTypes";
import { PostingFilterStatus, PostingStatus } from "../types/PostingTypes";
import { isPast } from "./DateTimeUtils";

export function getPostingFilterStatus(
  status: PostingStatus,
  endDate: Date,
  isScheduled: boolean,
): PostingFilterStatus {
  if (status === "DRAFT") {
    return PostingFilterStatus.DRAFT;
  }
  if (isPast(endDate)) {
    return PostingFilterStatus.PAST;
  }
  if (isScheduled) {
    return PostingFilterStatus.SCHEDULED;
  }
  return PostingFilterStatus.UNSCHEDULED;
}

export function getPostingFilterStatusBySignupStatuses(
  status: PostingStatus,
  endDate: Date,
  signupStatuses: ShiftSignupStatus[],
): PostingFilterStatus {
  return getPostingFilterStatus(
    status,
    endDate,
    signupStatuses.some((signupStatus) => signupStatus === "PUBLISHED"),
  );
}

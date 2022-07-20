import { ShiftDTO } from "../types/api/ShiftTypes";
import { ShiftSignupStatus } from "../types/api/SignupTypes";
import { PostingFilterStatus, PostingStatus } from "../types/PostingTypes";
import { isPast } from "./DateTimeUtils";

export function getPostingFilterStatus(
  status: PostingStatus,
  endDate: Date,
  shiftsWithSignups: ShiftDTO[],
): PostingFilterStatus {
  if (status === "DRAFT") {
    return PostingFilterStatus.DRAFT;
  }
  if (isPast(endDate)) {
    return PostingFilterStatus.PAST;
  }
  // TODO: Fix to return this when >1 of the shifts signup is published
  if (shiftsWithSignups.length === 0) {
    return PostingFilterStatus.UNSCHEDULED;
  }
  return PostingFilterStatus.SCHEDULED;
}

export function getRealPostingFilterStatus(
  status: PostingStatus,
  endDate: Date,
  signupStatuses: ShiftSignupStatus[],
): PostingFilterStatus {
  if (status === "DRAFT") {
    return PostingFilterStatus.DRAFT;
  }
  if (isPast(endDate)) {
    return PostingFilterStatus.PAST;
  }
  if (signupStatuses.some((signupStatus) => signupStatus === "PUBLISHED")) {
    return PostingFilterStatus.UNSCHEDULED;
  }
  return PostingFilterStatus.SCHEDULED;
}

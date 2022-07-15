import { ShiftDTO } from "../types/api/ShiftTypes";
import { PostingFilterStatus, PostingStatus } from "../types/PostingTypes";
import { isPast } from "./DateTimeUtils";

export default function getPostingFilterStatus(
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

export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED";

export type RecurrenceInterval = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE";

export type PostingRecurrenceType = "EVENT" | "OPPORTUNITY";

export enum PostingFilterStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  UNSCHEDULED = "UNSCHEDULED",
  PAST = "PAST",
}

export type ShiftSignupStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "PUBLISHED";

export type ShiftSignupPostingResponseDTO = {
  shiftId: string;
  shiftStartTime: string;
  shiftEndTime: string;
  status: ShiftSignupStatus;
  postingId: string;
  postingTitle: string;
  autoClosingDate: string;
  note: string;
};

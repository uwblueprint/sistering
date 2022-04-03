import { BranchResponseDTO } from "./BranchTypes";
import { SignupsAndVolunteerGraphQLResponseDTO, SignupsAndVolunteerResponseDTO } from "./SignupTypes";
import { SkillResponseDTO } from "./SkillTypes";

export type TimeBlock = {
  startTime: Date;
  endTime: Date;
};

export type RecurrenceInterval = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE";

export type ShiftDTO = {
  id: string;
  postingId: string;
} & TimeBlock;

export type ShiftRequestDTO = Omit<ShiftDTO, "id" | "postingId">;

export type ShiftBulkRequestDTO = {
  postingId: string;
  times: TimeBlock[];
  endDate: Date;
  startDate: Date;
  recurrenceInterval: RecurrenceInterval;
};

export type ShiftWithSignupAndVolunteerResponseDTO = ShiftResponseDTO & {
  signups: SignupsAndVolunteerResponseDTO[];
};

export type ShiftResponseDTO = ShiftDTO;

export type ShiftWithSignupAndVolunteerGraphQLResponseDTO = 
  Pick<ShiftWithSignupAndVolunteerResponseDTO, "startTime" | "endTime"> & 
  { signups: SignupsAndVolunteerGraphQLResponseDTO } & 
  Partial<ShiftWithSignupAndVolunteerResponseDTO>

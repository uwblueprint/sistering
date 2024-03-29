import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";
import { ShiftResponseDTO, RecurrenceInterval, TimeBlock } from "./ShiftTypes";
import { EmployeeUserResponseDTO } from "./EmployeeTypes";

export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED";

export type PostingDTO = {
  id: string;
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
};

export type PostingRequestDTO = Omit<PostingDTO, "id">;

export type PostingWithShiftsRequestDTO = PostingRequestDTO & {
  recurrenceInterval: RecurrenceInterval;
  times: TimeBlock[];
};

export type PostingResponseDTO = Omit<
  PostingDTO,
  "branchId" | "skills" | "employees"
> & {
  branch: BranchResponseDTO;
  shifts: ShiftResponseDTO[];
  skills: SkillResponseDTO[];
  employees: EmployeeUserResponseDTO[];
  isScheduled: boolean;
  recurrenceInterval: RecurrenceInterval;
};

export type PostingDataQueryResponse = {
  posting: PostingResponseDTO;
};

export type PostingDataQueryInput = {
  id: string;
};

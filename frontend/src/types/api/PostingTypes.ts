import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";
import { ShiftResponseDTO, RecurrenceInterval, TimeBlock } from "./ShiftTypes";
import { EmployeeResponseDTO } from "./EmployeeTypes";

export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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
  employees: EmployeeResponseDTO[];
};

export type PostingDataQueryResponse = {
  posting: PostingResponseDTO;
};

export type PostingDataQueryInput = {
  id: string;
};

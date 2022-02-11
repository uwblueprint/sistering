import { BranchResponseDTO } from "./BranchType";
import { SkillResponseDTO } from "./SkillType";
import { ShiftResponseDTO } from "./ShiftType";
import { EmployeeResponseDTO } from "./EmployeeType";

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
  startDate: Date;
  endDate: Date;
  autoClosingDate: Date;
  numVolunteers: number;
};

export type PostingRequestDTO = Omit<PostingDTO, "id">;

export type PostingResponseDTO = Omit<
  PostingDTO,
  "branchId" | "skills" | "employees"
> & {
  branch: BranchResponseDTO;
  shifts: ShiftResponseDTO[];
  skills: SkillResponseDTO[];
  employees: EmployeeResponseDTO[];
};

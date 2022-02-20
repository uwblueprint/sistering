import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";
import { ShiftResponseDTO } from "./ShiftTypes";
import { EmployeeResponseDTO } from "./EmployeeTypes";

export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostingDTO = {
  id: string;
  branchId: string;
  skills: string[];
  employees: string[];
}

export type PostingResponseDTO = {
  id: string;
  branch: BranchResponseDTO;
  shifts: [ShiftResponseDTO];
  skills: [SkillResponseDTO];
  employees: [EmployeeResponseDTO];
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

// export type PostingResponseDTO = Omit<
//   PostingDTO,
//   "branchId" | "skills" | "employees"
// > & {
//   branch: BranchResponseDTO;
//   shifts: ShiftResponseDTO[];
//   skills: SkillResponseDTO[];
//   employees: EmployeeResponseDTO[];
// };

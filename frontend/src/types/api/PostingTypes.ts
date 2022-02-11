type PostingType = "INDIVIDUAL" | "GROUP";

type PostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type BranchResponseDTO = {
  id: string;
  name: string;
};

type ShiftResponseDTO = {
  id: string;
  postingId: string;
  startTime: Date;
  endTime: Date;
};

type SkillResponseDTO = {
  id: string;
  name: string;
};

type EmployeeResponseDTO = {
  id: string;
  userId: string;
  branchId: string;
};
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

export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type RecurrenceInterval = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE";


type BranchResponseDTO {
  id: String!
  name: String!
}

type ShiftResponseDTO {
  id: String!
  postingId: String!
  startTime: Date!
  endTime: Date!
}

type SkillResponseDTO {
  id: String!
  name: String!
}

type EmployeeResponseDTO {
  id: String!
  userId: String!
  branchId: String!
}
export type PostingResponseDTO {
  id: String!
  branch: BranchResponseDTO!
  shifts: [ShiftResponseDTO!]!
  skills: [SkillResponseDTO!]!
  employees: [EmployeeResponseDTO!]!
  title: String!
  type: PostingType!
  status: PostingStatus!
  description: String!
  startDate: Date!
  endDate: Date!
  autoClosingDate: Date!
  numVolunteers: Number!
}
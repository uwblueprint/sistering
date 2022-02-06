export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type RecurrenceInterval = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE";


type BranchResponseDTO = {
  id: string
  name: string
}

type ShiftResponseDTO = {
  id: string
  postingId: string
  startTime: Date
  endTime: Date
}

export type SkillResponseDTO = {
  id: string
  name: string
}

type EmployeeResponseDTO = {
  id: string
  userId: string
  branchId: string
}
export type PostingResponseDTO = {
  id: string
  branch: BranchResponseDTO
  shifts: [ShiftResponseDTO]
  skills: [SkillResponseDTO]
  employees: [EmployeeResponseDTO]
  title: string
  type: PostingType
  status: PostingStatus
  description: string
  startDate: Date
  endDate: Date
  autoClosingDate: Date
  numVolunteers: number
}

export type PostingCardProps = {
  id: string,
  title: string, 
  skills: SkillResponseDTO[],
  description: string, 
  startDate: Date, 
  endDate: Date, 
  autoClosingDate: Date, 
  branchName: string,
  type: "EVENT" | "OPPORTUNITY"
}
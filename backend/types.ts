export type Role = "User" | "Admin";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type PostingDTO = {
  id: string;
  branchId: string;
  skills: string[];
  employees: string[];
  title: string;
  type: PostingType;
  description: string;
  startDate: string;
  endDate: string;
  autoClosingDate: string;
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

export type EmployeeResponseDTO = {
  id: string;
  userId: string;
  branchId: string;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type TimeBlock = {
  startTime: Date;
  endTime: Date;
};

export type TimeBlockDTO = {
  date: string;
  startTime: string;
  endTime: string;
};

export type RecurrenceInterval = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE";

export type ShiftDTO = {
  id: string;
  postingId: string;
  startTime: Date;
  endTime: Date;
};

export type ShiftRequestDTO = Omit<ShiftDTO, "id" | "postingId">;

export type ShiftBulkRequestDTO = {
  postingId: string;
  times: TimeBlockDTO[];
  endDate: string;
  recurrenceInterval: RecurrenceInterval;
};

export type ShiftResponseDTO = ShiftDTO;

export type ShiftSignupStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

export type ShiftSignupDTO = {
  shiftId: string;
  userId: string;
  numVolunteers: number;
  note: string;
  status: ShiftSignupStatus;
};

export type CreateShiftSignupDTO = Omit<ShiftSignupDTO, 'status'>;

export type UpdateShiftSignupRequestDTO = Omit<ShiftSignupDTO, 'shiftId' | 'userId'>;

export type ShiftSignupResponseDTO = ShiftSignupDTO;

export type SkillDTO = {
  id: string;
  name: string;
};

export type SkillRequestDTO = Omit<SkillDTO, "id">;

export type SkillResponseDTO = SkillDTO;

export type BranchDTO = {
  id: string;
  name: string;
};

export type BranchRequestDTO = Omit<BranchDTO, "id">;

export type BranchResponseDTO = BranchDTO;

export type Letters = "A" | "B" | "C" | "D";

export type PostingType = "INDIVIDUAL" | "GROUP";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";

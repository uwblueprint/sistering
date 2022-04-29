export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";

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
  phoneNumber: string | null;
};

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
  employees: EmployeeUserResponseDTO[];
};

export type EmployeeResponseDTO = {
  id: string;
  branchId: string;
  title: string;
};

export type VolunteerDTO = {
  id: string;
  hireDate: Date;
  dateOfBirth: Date | null;
  pronouns: string | null;
  skills: SkillResponseDTO[];
  branches: BranchResponseDTO[];
};

export type VolunteerUserRequestDTO = UserDTO &
  Omit<VolunteerDTO, "skills" | "branches"> & {
    skills: string[];
    branches: string[];
  };

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

export type CreateVolunteerUserDTO = Omit<VolunteerUserRequestDTO, "id"> & {
  password: string;
};

export type UpdateVolunteerUserDTO = Omit<VolunteerUserRequestDTO, "id">;

export type EmployeeUserDTO = {
  id: string;
  branchId: string;
  title: string;
};

export type EmployeeUserRequestDTO = UserDTO & EmployeeUserDTO;

export type EmployeeUserResponseDTO = UserDTO & EmployeeUserDTO;

export type CreateEmployeeUserDTO = Omit<EmployeeUserRequestDTO, "id"> & {
  password: string;
};

export type UpdateEmployeeUserDTO = Omit<EmployeeUserRequestDTO, "id">;

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

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
  startDate: Date;
  endDate: Date;
  recurrenceInterval: RecurrenceInterval;
};

export type ShiftDataWithoutPostingId = Omit<ShiftBulkRequestDTO, "postingId">;

export type ShiftResponseDTO = ShiftDTO;

export type PostingWithShiftsRequestDTO = PostingRequestDTO & {
  recurrenceInterval: RecurrenceInterval;
  times: TimeBlock[];
};

export type SignupsAndVolunteerResponseDTO = ShiftSignupResponseDTO & {
  volunteer: Omit<VolunteerUserResponseDTO, "skills" | "branches" | "email">;
};

export type ShiftWithSignupAndVolunteerResponseDTO = ShiftResponseDTO & {
  signups: SignupsAndVolunteerResponseDTO[];
};

export type ShiftSignupStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "PUBLISHED";

export type ShiftSignupDTO = {
  shiftId: string;
  userId: string;
  numVolunteers: number;
  note: string;
  status: ShiftSignupStatus;
};

export type CreateShiftSignupDTO = Omit<ShiftSignupDTO, "status">;

export type UpsertShiftSignupDTO = CreateShiftSignupDTO & {
  status: ShiftSignupStatus | null;
};

export type DeleteShiftSignupDTO = Omit<
  ShiftSignupDTO,
  "numVolunteers" | "note" | "status"
>;

export type UpsertDeleteShiftSignupsRequestDTO = {
  upsertShiftSignups: UpsertShiftSignupDTO[];
  deleteShiftSignups: DeleteShiftSignupDTO[];
};

export type UpdateShiftSignupRequestDTO = Omit<
  ShiftSignupDTO,
  "shiftId" | "userId"
>;

export type ShiftSignupResponseDTO = {
  shiftStartTime: Date;
  shiftEndTime: Date;
} & ShiftSignupDTO;

export type ShiftSignupPostingResponseDTO = {
  postingId: string;
  postingTitle: string;
  autoClosingDate: Date;
} & ShiftSignupResponseDTO;

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

export type PostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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

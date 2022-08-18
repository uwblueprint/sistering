export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserInviteResponse = {
  email: string;
  role: Role;
  uuid: string;
  createdAt: Date;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber: string | null;
  languages: LanguageResponseDTO[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
  dateOfBirth: Date | null;
  pronouns: string;
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
  isScheduled: boolean;
  recurrenceInterval: RecurrenceInterval;
};

export type VolunteerDTO = {
  id: string;
  hireDate: Date;
  skills: SkillResponseDTO[];
  branches: BranchResponseDTO[];
};

export type VolunteerUserRequestDTO = UserDTO &
  Omit<VolunteerDTO, "skills" | "branches"> & {
    skills: string[];
    branches: string[];
    languages: string[];
  };

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

export type CreateVolunteerUserDTO = Omit<VolunteerUserRequestDTO, "id"> & {
  password: string;
  token: string;
};

export type UpdateVolunteerUserDTO = Omit<VolunteerUserRequestDTO, "id">;

export type EmployeeUserDTO = {
  id: string;
};

export type EmployeeUserRequestDTO = UserDTO &
  EmployeeUserDTO & {
    branches: string[];
    languages: string[];
  };

export type EmployeeUserResponseDTO = UserDTO &
  EmployeeUserDTO & {
    branches: BranchResponseDTO[];
  };

export type CreateEmployeeUserDTO = Omit<EmployeeUserRequestDTO, "id"> & {
  password: string;
  token: string;
};

export type UpdateEmployeeUserDTO = Omit<EmployeeUserRequestDTO, "id">;

export type CreateUserDTO = Omit<UserDTO, "id" | "languages"> & {
  password: string;
  languages: string[];
};

export type UpdateUserDTO = Omit<UserDTO, "id" | "languages"> & {
  languages: string[];
};

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

export type ShiftBulkRequestWithoutPostingId = Omit<
  ShiftBulkRequestDTO,
  "postingId"
>;

export type ShiftResponseDTO = ShiftDTO;

export type PostingWithShiftsRequestDTO = PostingRequestDTO & {
  recurrenceInterval: RecurrenceInterval;
  times: TimeBlock[];
};

export type SignupsAndVolunteerResponseDTO = ShiftSignupResponseDTO & {
  volunteer: Omit<
    VolunteerUserResponseDTO,
    "skills" | "branches" | "languages" | "email"
  >;
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

export type UpsertShiftSignupDTO = Omit<ShiftSignupDTO, "status"> & {
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

export type LanguageDTO = {
  id: string;
  name: string;
};

export type LanguageRequestDTO = Omit<LanguageDTO, "id">;

export type LanguageResponseDTO = LanguageDTO;

export type Letters = "A" | "B" | "C" | "D";

export type PostingType = "INDIVIDUAL" | "GROUP";

export type PostingStatus = "DRAFT" | "PUBLISHED";

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

export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type SkillResponseDTO = {
  id: string;
  name: string;
};

export type SkillDTO = {
  id: string;
  name: string;
};

export type BranchResponseDTO = {
  id: string;
  name: string;
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

export type VolunteerDTO = {
  id: string;
  hireDate: Date;
  dateOfBirth: Date | null;
  pronouns: string | null;
  skills: SkillResponseDTO[];
  branches: BranchResponseDTO[];
};

export type EmployeeDTO = {
  id: string;
  userId: string;
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

export type EmployeeUserDTO = UserDTO & EmployeeDTO;

export type CreateEmployeeUserDTO = Omit<EmployeeUserDTO, "id"> & {
  password: string;
};

export type UpdateEmployeeUserDTO = Omit<EmployeeUserDTO, "id"> & {
  password: string;
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

export type SkillRequestDTO = Omit<SkillResponseDTO, "id">;

export type BranchDTO = {
  id: string;
  name: string;
};

export type BranchRequestDTO = Omit<BranchDTO, "id">;

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

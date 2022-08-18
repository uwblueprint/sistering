import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";
import { LanguageResponseDTO } from "./LanguageTypes";

export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | undefined;
  role: Role;
  phoneNumber: string | null;
  languages: LanguageResponseDTO[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
  dateOfBirth: string | null;
  pronouns: string | null;
  branches: BranchResponseDTO[];
};

export type VolunteerDTO = {
  id: string;
  hireDate: string;
  skills: SkillResponseDTO[];
};

export type VolunteerUserRequestDTO = Omit<
  UserDTO,
  "branches" | "role" | "languages"
> &
  Omit<VolunteerDTO, "skills"> & {
    skills: string[];
    branches: string[];
    languages: string[];
  };

export type VolunteerUserResponseDTO = Omit<UserDTO, "email"> &
  VolunteerDTO & {
    email: string; // Non-null email field
  };

export type CreateVolunteerUserDTO = Omit<VolunteerUserRequestDTO, "id"> & {
  password: string;
  phoneNumber: string;
  hireDate: string;
  dateOfBirth: string | null;
  skills: string[];
  branches: BranchResponseDTO[];
  token: string | null;
};

export type UpdateVolunteerUserDTO = Omit<VolunteerUserRequestDTO, "id">;

export type EmployeeDTO = {
  id: string;
};

export type EmployeeUserRequestDTO = Omit<
  UserDTO,
  "branches" | "role" | "languages"
> &
  EmployeeDTO & {
    branches: string[];
    languages: string[];
  };

export type EmployeeUserResponseDTO = UserDTO & EmployeeDTO;

export type CreateEmployeeUserDTO = Omit<EmployeeUserRequestDTO, "id"> & {
  password: string;
  branches: BranchResponseDTO[];
  token: string | null;
};

export type UpdateEmployeeUserDTO = Omit<EmployeeUserRequestDTO, "id">;

export type UserInviteResponseDTO = {
  uuid: string;
  role: Role;
  email: string;
};

import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";

export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";

export const LANGUAGES = [
  "ENGLISH",
  "FRENCH",
  "ITALIAN",
  "CHINESE",
  "SPANISH",
  "HINDI",
  "RUSSIAN",
] as const;
type LanguageTuple = typeof LANGUAGES;
export type Language = LanguageTuple[number];

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | undefined;
  role: Role;
  phoneNumber: string | null;
  languages: Language[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
  branches: BranchResponseDTO[];
};

export type VolunteerDTO = {
  id: string;
  hireDate: string;
  dateOfBirth: string | null;
  pronouns: string | null;
  skills: SkillResponseDTO[];
};

export type VolunteerUserRequestDTO = Omit<UserDTO, "branches" | "role"> &
  Omit<VolunteerDTO, "skills"> & {
    skills: string[];
    branches: string[];
  };

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

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

export type EmployeeUserRequestDTO = Omit<UserDTO, "branches" | "role"> &
  EmployeeDTO & {
    branches: string[];
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

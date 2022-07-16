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
  email: string;
  role: Role;
  phoneNumber: string | null;
  languages: Language[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
};

export type VolunteerDTO = {
  id: string;
  hireDate: Date;
  dateOfBirth: string | null;
  pronouns: string | null;
  skills: SkillResponseDTO[];
  branches: BranchResponseDTO[];
  languages: Language[];
};

export type EmployeeUserDTO = {
  id: string;
  branches: BranchResponseDTO[];
};

export type CreateVolunteerDTO = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  emergencyContactPhone: string;
  hireDate: string;
  dateOfBirth: string | null;
  skills: string[];
  languages: string[];
  branches: BranchResponseDTO[];
};

export type CreateEmployeeDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergencyContactPhone: string;
  password: string;
  languages: string[];
  branches: BranchResponseDTO[];
};

export type EditVolunteerDTO = Omit<
  CreateVolunteerDTO,
  "password" | "hireDate"
>;

export type EditEmployeeDTO = Omit<CreateEmployeeDTO, "password">;

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

export type EmployeeUserResponseDTO = UserDTO & EmployeeUserDTO;

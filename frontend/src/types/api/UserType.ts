import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";

export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";
export type Language =
  | "ENGLISH"
  | "FRENCH"
  | "ITALIAN"
  | "CHINESE"
  | "SPANISH"
  | "HINDI"
  | "RUSSIAN";

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
};

export type VolunteerDTO = {
  id: string;
  hireDate: Date;
  dateOfBirth: Date | null;
  pronouns: string | null;
  skills: SkillResponseDTO[];
  branches: BranchResponseDTO[];
  languages: Language[];
};

export type CreateVolunteerDTO = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  hireDate: string;
  dateOfBirth: string | null;
  skills: string[];
  branches: BranchResponseDTO[];
};

export type CreateEmployeeDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  branchId: number;
  title: string;
};

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

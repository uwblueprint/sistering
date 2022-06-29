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

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

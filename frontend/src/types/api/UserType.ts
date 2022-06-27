import { BranchResponseDTO } from "./BranchTypes";
import { SkillResponseDTO } from "./SkillTypes";

export type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";

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
};

export type VolunteerUserResponseDTO = UserDTO & VolunteerDTO;

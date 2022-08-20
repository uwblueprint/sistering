import { LanguageResponseDTO } from "./LanguageTypes";
import { BranchResponseDTO } from "./BranchTypes";

export type EmployeeUserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
  pronouns: string | null;
  dateOfBirth: string | null;
  branches: BranchResponseDTO[];
  languages: LanguageResponseDTO[];
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

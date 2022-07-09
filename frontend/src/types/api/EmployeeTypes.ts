import { Language } from "./UserType";
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
  branches: BranchResponseDTO[];
  title: string;
  languages: Language[];
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

import { Language } from "./UserType";

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
  branchId: string;
  languages: Language[];
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

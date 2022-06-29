import { Language } from "./UserType";

export type EmployeeUserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  branchId: string;
  title: string;
  languages: Language[];
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

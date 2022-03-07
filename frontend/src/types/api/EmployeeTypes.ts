export type EmployeeResponseDTO = {
  id: string;
  branchId: string;
};

export type EmployeeUserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  branchId: string;
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

export type EmployeeResponseDTO = {
  id: string;
  branchId: string;
  title: string;
};

export type EmployeeUserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  branchId: string;
  title: string;
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

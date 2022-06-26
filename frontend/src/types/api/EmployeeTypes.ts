export type EmployeeUserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  branchId: string;
  title: string;
};

export type EmployeeUserResponseDTO = EmployeeUserDTO;

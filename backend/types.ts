export type Role = "User" | "Admin";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type TimeBlock = {
  startTime: Date;
  endTime: Date;
};

export type TimeBlockDTO = {
  date: string;
  startTime: string;
  endTime: string;
};

export type RecurrenceInterval = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "NONE";

export type ShiftDTO = {
  id: string;
  postingId: string;
  startTime: Date;
  endTime: Date;
  // TODO: Add signups DTO
};

export type ShiftRequestDTO = Omit<ShiftDTO, "id">;

export type BulkShiftRequestDTO = {
  postingId: string;
  times: TimeBlockDTO[];
  endDate: string;
  recurrenceInterval: RecurrenceInterval;
};

export type ShiftResponseDTO = ShiftDTO;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";

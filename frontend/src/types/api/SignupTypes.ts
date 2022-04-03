export type SignupDTO = {
  id: string;
  shiftId: string;
  userId: string;
  numVolunteers: number;
  note: string;
};

export type SignupRequestDTO = Omit<
  SignupDTO,
  "id" | "numVolunteers" | "userId"
>;

export type DeleteSignupRequestDTO = Omit<
  SignupDTO,
  "id" | "numVolunteers" | "note"
>;

export type SignupResponseDTO = SignupDTO;

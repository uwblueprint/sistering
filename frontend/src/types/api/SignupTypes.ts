import { VolunteerUserResponseDTO } from "./UserType";

export type ShiftSignupStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "PUBLISHED";

export type SignupDTO = {
  id: string;
  shiftId: string;
  userId: string;
  numVolunteers: number;
  note: string;
  status: ShiftSignupStatus;
};

export type SignupRequestDTO = Omit<
  SignupDTO,
  "id" | "numVolunteers" | "userId" | "status"
>;

export type SignupRequest = Omit<SignupRequestDTO, "status">;

export type DeleteSignupRequestDTO = Omit<
  SignupDTO,
  "id" | "numVolunteers" | "note"
>;

export type DeleteSignupRequest = Omit<
  DeleteSignupRequestDTO,
  "status" | "userId"
> & { toDelete: boolean };

export type SignupResponseDTO = SignupDTO;

export type ShiftSignupResponseDTO = {
  shiftStartTime: Date;
  shiftEndTime: Date;
} & SignupDTO;

export type SignupsAndVolunteerResponseDTO = ShiftSignupResponseDTO & {
  volunteer: VolunteerUserResponseDTO;
};

export type SignupsAndVolunteerGraphQLResponseDTO = Pick<
  SignupsAndVolunteerResponseDTO,
  "note" | "status"
> & {
  volunteer: Pick<VolunteerUserResponseDTO, "firstName" | "lastName">;
} & Partial<SignupsAndVolunteerResponseDTO>;

export type UpdateShiftSignupRequestDTO = Pick<
  SignupDTO,
  "numVolunteers" | "note" | "status"
>;

export type AdminSchedulingSignupsAndVolunteerResponseDTO = Omit<
  ShiftSignupResponseDTO,
  "userId" | "shiftId"
> & {
  volunteer: Pick<VolunteerUserResponseDTO, "firstName" | "lastName" | "id">;
};

export type UpsertSignupDTO = Omit<SignupDTO, "id">;

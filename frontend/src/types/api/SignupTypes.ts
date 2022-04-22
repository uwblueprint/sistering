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

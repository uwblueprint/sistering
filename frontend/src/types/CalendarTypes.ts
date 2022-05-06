import { SignupsAndVolunteerGraphQLResponseDTO } from "./api/SignupTypes";

export type Event = {
  id: string;
  start: Date;
  end: Date;
  signups: SignupsAndVolunteerGraphQLResponseDTO;
};

export type MonthEvent = Event & {
  groupId: string;
};

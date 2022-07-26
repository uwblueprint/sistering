import { Role } from "../AuthTypes";

export type UserInviteDTO = {
  email: string;
  createdAt: Date;
  role: Role;
  uuid: string;
};

export type UserInvitesQueryResponse = {
  getUserInvites: UserInviteDTO[];
};

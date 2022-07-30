import { Role } from "../AuthTypes";

export type UserInviteDTO = {
  email: string;
  createdAt: Date;
  role: Role;
  uuid: string;
};

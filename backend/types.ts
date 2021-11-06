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

export type PostingDTO = {
  id: string;
  branchId: string;
  //TODO
  // branch: Branch;
  // shifts: Shift[];
  // skills          PostingOnSkill[]
  // employee        PostingOnEmployeePoc[]
  title: string;
  type: PostingType;
  description: string;
  startDate: Date;               
  endDate: Date;               
  autoClosingDate: Date;               
  numVolunteers: number;                    
};

export type PostingRequestDTO = Omit<PostingDTO, "id">;

export type PostingResponseDTO = PostingDTO;

//here

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type Letters = "A" | "B" | "C" | "D";

export type PostingType = "INDIVIDUAL" | "GROUP";

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

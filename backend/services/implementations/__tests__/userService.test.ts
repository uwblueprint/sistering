import { PrismaClient, Role } from "@prisma/client";

import UserService from "../userService";
import { UserDTO } from "../../../types";

const testUsers = [
  {
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: Role.ADMIN,
  },
  {
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: Role.ADMIN,
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("pg userService", () => {
  const userService = new UserService();
  const prisma = new PrismaClient();

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  it("getUsers", async () => {
    await prisma.user.createMany({ data: testUsers });

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
    });
  });
});

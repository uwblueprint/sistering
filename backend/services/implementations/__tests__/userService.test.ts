import { PrismaClient, Role } from "@prisma/client";
import UserService from "../userService";
import { UserDTO } from "../../../types";

const testUsers = [
  {
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: Role.Admin,
  },
  {
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: Role.User,
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("pg userService", () => {
  let userService: UserService;
  const dbString = process.env.DATABASE_URL;
  let prisma: PrismaClient;

  beforeAll(async () => {
    process.env.DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_TEST}`;
    prisma = new PrismaClient();
    migrate("up");
  });

  beforeEach(async () => {
    userService = new UserService();
    prisma.user.deleteMany({});
  });

  afterAll(async () => {
    process.env.DATABASE_URL = dbString;
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

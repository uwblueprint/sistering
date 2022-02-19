import { PrismaClient, Role, PostingType, PostingStatus } from "@prisma/client";
import { addDays, setTime } from "../utilities/dateUtils";

const prisma = new PrismaClient();

const users = [
  {
    firstName: "admin",
    lastName: "sistering",
    authId: process.env.ADMIN_UID,
    role: Role.ADMIN,
  },
  {
    firstName: "volunteer",
    lastName: "sistering",
    authId: process.env.VOLUNTEER_UID,
    role: Role.VOLUNTEER,
    volunteer: {
      create: {
        pronouns: "they/them",
        hireDate: new Date(),
        dateOfBirth: new Date("August 19, 2000 23:15:30"),
      },
    },
  },
  {
    firstName: "employee",
    lastName: "sistering",
    authId: process.env.EMPLOYEE_UID,
    role: Role.EMPLOYEE,
  },
];

const branches = [
  {
    name: "Kitchen",
  },
  {
    name: "Arts",
  },
  {
    name: "Git Branch",
  },
];

const skills = [
  {
    name: "Danish",
  },
  {
    name: "CPR",
  },
  {
    name: "Breakdancing",
  },
];

const today = new Date();
const postings = [
  {
    title: "Danish Instructor",
    type: PostingType.INDIVIDUAL,
    status: PostingStatus.PUBLISHED,
    description: "Lead a Danish making class in Danish",
    startDate: addDays(today, 30),
    endDate: addDays(today, 50),
    autoClosingDate: addDays(today, 20),
    numVolunteers: 3,
    shifts: {
      create: [
        {
          startTime: setTime(addDays(today, 31), 13, 30),
          endTime: setTime(addDays(today, 31), 14, 30),
        },
        {
          startTime: setTime(addDays(today, 33), 13, 30),
          endTime: setTime(addDays(today, 33), 14, 30),
        },
        {
          startTime: setTime(addDays(today, 35), 13, 30),
          endTime: setTime(addDays(today, 35), 14, 30),
        },
        {
          startTime: setTime(addDays(today, 35), 13, 30),
          endTime: setTime(addDays(today, 35), 14, 30),
        },
        {
          startTime: setTime(addDays(today, 37), 13, 30),
          endTime: setTime(addDays(today, 37), 14, 30),
        },
      ],
    },
  },
  {
    title: "Criossant Making",
    type: PostingType.INDIVIDUAL,
    status: PostingStatus.DRAFT,
    description: "Help with a criossant making class.",
    startDate: addDays(today, 20),
    endDate: addDays(today, 30),
    autoClosingDate: addDays(today, 15),
    numVolunteers: 2,
    shifts: {
      create: [
        {
          startTime: setTime(addDays(today, 21), 18, 0),
          endTime: setTime(addDays(today, 21), 19, 0),
        },
        {
          startTime: setTime(addDays(today, 23), 18, 0),
          endTime: setTime(addDays(today, 23), 19, 0),
        },
        {
          startTime: setTime(addDays(today, 25), 18, 0),
          endTime: setTime(addDays(today, 25), 19, 0),
        },
        {
          startTime: setTime(addDays(today, 27), 18, 0),
          endTime: setTime(addDays(today, 27), 19, 0),
        },
        {
          startTime: setTime(addDays(today, 29), 18, 0),
          endTime: setTime(addDays(today, 29), 19, 0),
        },
      ],
    },
  },
];

const main = async () => {
  const seedBranches = await prisma.$transaction(
    branches.map((branch) =>
      prisma.branch.upsert({
        where: { name: branch.name },
        update: {},
        create: {
          ...branch,
        },
      }),
    ),
  );

  const employee = {
    create: {
      branch: {
        connect: {
          id: seedBranches[0].id,
        },
      },
    },
  };

  const seedSkills = await prisma.$transaction(
    skills.map((skill) =>
      prisma.skill.upsert({
        where: { name: skill.name },
        update: {},
        create: {
          ...skill,
        },
      }),
    ),
  );

  const seedUsers = await prisma.$transaction(
    users.map((user) => {
      if (!user.authId) {
        throw new Error(
          `Test user auth id for ${user.role} is not in environment variables.`,
        );
      }

      return prisma.user.upsert({
        where: { authId: user.authId },
        update: {},
        create: {
          firstName: user.firstName,
          lastName: user.lastName,
          authId: user.authId,
          role: user.role,
          volunteer: user.volunteer,
          employee: user.role === Role.EMPLOYEE ? employee : {},
        },
        include: {
          employee: {
            include: {
              postings: true,
            },
          },
        },
      });
    }),
  );

  const seedEmployee = seedUsers.find((user) => user.role === "EMPLOYEE");
  if (seedEmployee?.employee && !seedEmployee.employee.postings.length) {
    await prisma.$transaction(
      postings.map((posting) =>
        prisma.posting.create({
          data: {
            ...posting,
            branch: {
              connect: {
                id: seedBranches[0].id,
              },
            },
            employees: {
              connect: [{ id: seedEmployee?.employee?.id }],
            },
            skills: {
              connect: [{ id: seedSkills[0].id }, { id: seedSkills[1].id }],
            },
          },
        }),
      ),
    );
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

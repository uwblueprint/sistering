import {
  PrismaClient,
  Role,
  PostingType,
  PostingStatus,
  SignupStatus,
} from "@prisma/client";
import { random, sample } from "lodash";
import { addDays, setTime } from "../utilities/dateUtils";

const prisma = new PrismaClient();

const users = [
  {
    firstName: "Anastasia",
    lastName: "Admin",
    authId: process.env.ADMIN_UID,
    role: Role.ADMIN,
    volunteer: {
      create: {
        pronouns: "they/them",
        hireDate: new Date(),
        dateOfBirth: new Date("August 19, 2000 23:15:30"),
      },
    },
  },
  {
    firstName: "Valorie",
    lastName: "Volunteer",
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
    firstName: "Edna",
    lastName: "Employee",
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

const numPostings = 15;
const numShiftsPerPosting = 30;
const postingStartOffset = 20;
const postingEndOffset = 50;
const postingClosingOffset = 10;
const postings: any[] = [];
for (let i = 0; i < numPostings; i += 1) {
  const shifts = [];
  // generate shifts on random days between the posting start and end date
  for (let j = 0; j < numShiftsPerPosting; j += 1) {
    const shiftDay = random(postingStartOffset, postingEndOffset);
    shifts.push({
      startTime: setTime(addDays(today, postingStartOffset + shiftDay), 18, 0),
      endTime: setTime(addDays(today, postingEndOffset + shiftDay), 19, 0),
    });
  }

  const posting = {
    title: "Danish Instructor",
    type: PostingType.INDIVIDUAL,
    status: PostingStatus.PUBLISHED,
    description: "Lead a Danish making class in Danish",
    startDate: addDays(today, postingStartOffset),
    endDate: addDays(today, postingEndOffset),
    autoClosingDate: addDays(today, postingClosingOffset),
    numVolunteers: 1,
    shifts: {
      create: shifts,
    },
  };
  postings.push(posting);
}

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

  const seedVolunteers = seedUsers.filter((user) => user.role !== "EMPLOYEE");
  const shifts = await prisma.shift.findMany();
  const shiftSignups: any[] = [];

  shifts.forEach((shift) => {
    seedVolunteers.forEach((user) => {
      shiftSignups.push({
        shiftId: shift.id,
        userId: user.id,
        numVolunteers: 1,
        // randomly assign a status
        status: sample(SignupStatus),
        note: "",
      });
    });
  });

  await prisma.signup.createMany({
    data: shiftSignups,
  });
};

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

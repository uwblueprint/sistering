import {
  PrismaClient,
  Role,
  PostingType,
  PostingStatus,
  SignupStatus,
} from "@prisma/client";
import { addDays, setTime } from "../utilities/dateUtils";

const prisma = new PrismaClient();

const adminUsers = [
  {
    firstName: "Aoife",
    lastName: "Admin",
    authId: process.env.ADMIN_UID,
    role: Role.ADMIN,
  },
];

enum Branches {
  Kitchen = "Kitchen",
  Arts = "Arts",
  Git_Branch = "Git Branch",
}

enum Skills {
  Cooking = "Cooking",
  CPR = "CPR",
  Dancing = "Dancing",
  Yoga = "Yoga",
}

enum Languages {
  English = "English",
  French = "French",
  Italian = "Italian",
  Chinese = "Chinese",
  Spanish = "Spanish",
  Hindi = "Hindi",
  Russian = "Russian",
}

const employeeUsers = [
  {
    firstName: "Edna",
    lastName: "Employee",
    authId: process.env.EMPLOYEE_UID,
    role: Role.EMPLOYEE,
    branches: [{ name: Branches.Kitchen }],
    languages: [{ name: Languages.English }],
  },
  {
    firstName: "Emma",
    lastName: "Employee",
    authId: process.env.EMPLOYEE1_UID,
    role: Role.EMPLOYEE,
    branches: [{ name: Branches.Arts }],
    languages: [{ name: Languages.English }, { name: Languages.French }],
  },
];

const volunteerUsers = [
  {
    firstName: "Valorie",
    lastName: "Volunteer",
    authId: process.env.VOLUNTEER_UID,
    role: Role.VOLUNTEER,
    dateOfBirth: new Date("August 19, 2000 23:15:30"),
    pronouns: "they/them",
    languages: [
      { name: Languages.English },
      { name: Languages.French },
      { name: Languages.Chinese },
    ],
    volunteer: {
      hireDate: new Date(),
      branches: [{ name: Branches.Arts }],
      skills: [
        { name: Skills.Cooking },
        { name: Skills.CPR },
        { name: Skills.Dancing },
        { name: Skills.Yoga },
      ],
    },
  },
  {
    firstName: "Varna",
    lastName: "Volunteer",
    authId: process.env.VOLUNTEER1_UID,
    role: Role.VOLUNTEER,
    dateOfBirth: new Date("August 19, 2000 23:15:30"),
    pronouns: "she/her",
    languages: [{ name: Languages.Hindi }, { name: Languages.Russian }],
    volunteer: {
      hireDate: addDays(new Date(), -7),
      branches: [{ name: Branches.Kitchen }],
      skills: [],
    },
  },
];

const today = new Date();
const postings = [
  {
    title: "Yoga Instructor",
    type: PostingType.INDIVIDUAL,
    status: PostingStatus.PUBLISHED,
    description:
      '{"blocks":[{"key":"bv0s8","text":"' +
      "We are looking for a yoga instructor who can speak to our Danish community." +
      '","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    startDate: addDays(today, 30),
    endDate: addDays(today, 38),
    autoClosingDate: addDays(today, 20),
    numVolunteers: 3,
    branch: { name: Branches.Arts },
    skills: [{ name: Skills.Yoga }, { name: Skills.CPR }],
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
    status: PostingStatus.PUBLISHED,
    description:
      '{"blocks":[{"key":"bv0s8","text":"' +
      "We are looking for some volunteers to help lead a croissant making class." +
      '","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    startDate: addDays(today, 20),
    endDate: addDays(today, 30),
    autoClosingDate: addDays(today, 15),
    numVolunteers: 2,
    branch: { name: Branches.Kitchen },
    skills: [{ name: Skills.Cooking }, { name: Skills.CPR }],
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
  await prisma.$transaction(
    Object.values(Branches).map((branchName) =>
      prisma.branch.upsert({
        where: { name: branchName },
        update: {},
        create: {
          name: branchName,
        },
      }),
    ),
  );

  await prisma.$transaction(
    Object.values(Skills).map((skillName) =>
      prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: {
          name: skillName,
        },
      }),
    ),
  );

  await prisma.$transaction(
    Object.values(Languages).map((languageName) =>
      prisma.language.upsert({
        where: { name: languageName },
        update: {},
        create: {
          name: languageName,
        },
      }),
    ),
  );

  await prisma.$transaction(
    adminUsers.map((user) => {
      if (!user.authId) {
        throw new Error(
          `Test admin auth id for ${user.firstName} is not in environment variables.`,
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
          pronouns: "they/them",
          employee: {
            create: {},
          },
        },
      });
    }),
  );

  const seedEmployees = await prisma.$transaction(
    employeeUsers.map((employee) => {
      if (!employee.authId) {
        throw new Error(
          `Test employee auth id for ${employee.firstName} is not in environment variables.`,
        );
      }

      return prisma.user.upsert({
        where: { authId: employee.authId },
        update: {},
        create: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          authId: employee.authId,
          role: employee.role,
          pronouns: "they/them",
          languages: {
            connect: employee.languages,
          },
          employee: {
            create: {
              branches: {
                connect: employee.branches,
              },
            },
          },
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

  const seedVolunteers = await prisma.$transaction(
    volunteerUsers.map((user) => {
      if (!user.authId) {
        throw new Error(
          `Test volunteer auth id for ${user.firstName} is not in environment variables.`,
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
          pronouns: "they/them",
          languages: {
            connect: user.languages,
          },
          volunteer: {
            create: {
              ...user.volunteer,
              branches: { connect: user.volunteer.branches },
              skills: { connect: user.volunteer.skills },
            },
          },
        },
      });
    }),
  );

  const seedPostings = await prisma.$transaction(
    postings.map((posting, i) => {
      return prisma.posting.create({
        data: {
          ...posting,
          branch: {
            connect: posting.branch,
          },
          employees: {
            connect: [{ id: seedEmployees[i]?.employee?.id }],
          },
          skills: {
            connect: posting.skills,
          },
        },
        include: {
          shifts: true,
        },
      });
    }),
  );

  const signupTransactions = seedPostings.map((posting, index) => {
    const oddShifts = posting.shifts.filter((_, i) => i % 2 === 0);

    return oddShifts.map((shift) =>
      prisma.signup.upsert({
        where: {
          shiftId_userId: {
            shiftId: shift.id,
            userId: seedVolunteers[index].id,
          },
        },
        update: {},
        create: {
          note: "test note",
          status: SignupStatus.PENDING,
          numVolunteers: 3,
          shiftId: shift.id,
          userId: seedVolunteers[index].id,
        },
      }),
    );
  });

  await prisma.$transaction(signupTransactions.flat());
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

import { ShiftSignupStatus } from "../../../../types/api/SignupTypes";

type Role = "ADMIN" | "VOLUNTEER" | "EMPLOYEE";
export type Signup = {
  shiftId: string;
  shiftStartTime: Date;
  shiftEndTime: Date;
  userId: string;
  numVolunteers: number;
  note: string;
  status: ShiftSignupStatus;
  volunteer: {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    phoneNumber: string;
    hireDate: Date;
    dateOfBirth: Date;
    pronouns: string;
  };
};
export type ShiftWithSignupAndVolunteerResponseDTO = {
  id: string;
  postingId: string;
  startTime: Date;
  endTime: Date;
  signups: Signup[];
};

export const shiftsData: ShiftWithSignupAndVolunteerResponseDTO[] = [
  {
    id: "1",
    postingId: "1",
    startTime: new Date("2022-04-11T13:30"),
    endTime: new Date("2022-04-11T15:30"),
    signups: [
      {
        shiftId: "1",
        shiftStartTime: new Date(),
        shiftEndTime: new Date(),
        userId: "1",
        numVolunteers: 4,
        note: "plz hire me",
        status: "PENDING",
        volunteer: {
          id: "1",
          firstName: "Brian",
          lastName: "Tu",
          role: "VOLUNTEER",
          phoneNumber: "647-123-4567",
          hireDate: new Date(),
          dateOfBirth: new Date(),
          pronouns: "he/him",
        },
      },
      {
        shiftId: "1",
        shiftStartTime: new Date(),
        shiftEndTime: new Date(),
        userId: "1",
        numVolunteers: 4,
        note: "don't hire me",
        status: "PENDING",
        volunteer: {
          id: "2",
          firstName: "Joseph",
          lastName: "Hu",
          role: "VOLUNTEER",
          phoneNumber: "647-123-4567",
          hireDate: new Date(),
          dateOfBirth: new Date(),
          pronouns: "he/him",
        },
      },
    ],
  },
  {
    id: "2",
    postingId: "1",
    startTime: new Date("2022-04-11T16:30"),
    endTime: new Date("2022-04-11T18:30"),
    signups: [
      {
        shiftId: "2",
        shiftStartTime: new Date(),
        shiftEndTime: new Date(),
        userId: "1",
        numVolunteers: 4,
        note: "plz hire me",
        status: "PENDING",
        volunteer: {
          id: "3",
          firstName: "Sherry",
          lastName: "Li",
          role: "VOLUNTEER",
          phoneNumber: "647-123-4567",
          hireDate: new Date(),
          dateOfBirth: new Date(),
          pronouns: "she/her",
        },
      },
      {
        shiftId: "2",
        shiftStartTime: new Date(),
        shiftEndTime: new Date(),
        userId: "1",
        numVolunteers: 4,
        note: "don't hire me",
        status: "PENDING",
        volunteer: {
          id: "4",
          firstName: "Lena",
          lastName: "Nguyen",
          role: "VOLUNTEER",
          phoneNumber: "647-123-4567",
          hireDate: new Date(),
          dateOfBirth: new Date(),
          pronouns: "she/her",
        },
      },
    ],
  },
];

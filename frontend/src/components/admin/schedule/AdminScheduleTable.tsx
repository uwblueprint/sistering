import React, { useEffect } from "react";
import { Table, Tbody } from "@chakra-ui/react";
import AdminScheduleTableDate from "./AdminScheduleTableDate";
import AdminScheduleTableRow from "./AdminScheduleTableRow";

export const TableTestData = [
  {
    date: new Date("2022-03-07"),
    signups: [],
  },
  {
    date: new Date("2022-03-06"),
    signups: [
      {
        startTime: new Date("2022-03-06 10:00:00"),
        endTime: new Date("2022-03-06 11:00:00"),
        volunteer: "Lambert Liu",
        userId: "1",
      },
      {
        startTime: new Date("2022-03-06 15:00:00"),
        endTime: new Date("2022-03-06 17:00:00"),
      },
    ],
  },
  {
    date: new Date("2022-03-08"),
    signups: [
      {
        startTime: new Date("2022-03-08 10:00:00"),
        endTime: new Date("2022-03-08 11:00:00"),
        volunteer: "Lambert Liu",
        userId: "1",
      },
    ],
  },
  {
    date: new Date("2022-03-10"),
    signups: [
      {
        startTime: new Date("2022-03-10 14:00:00"),
        endTime: new Date("2022-03-10 16:00:00"),
        volunteer: "Brian Tu",
        userId: "69",
      },
      {
        startTime: new Date("2022-03-10 15:00:00"),
        endTime: new Date("2022-03-10 17:00:00"),
        volunteer: "Albert Lai",
        userId: "420",
      },
    ],
  },
  {
    date: new Date("2022-03-09"),
    signups: [],
  },
  {
    date: new Date("2022-03-11"),
    signups: [
      {
        startTime: new Date("2022-03-11 11:00:00"),
        endTime: new Date("2022-03-11 13:00:00"),
        volunteer: "Albert Lai",
        userId: "420",
      },
    ],
  },
  {
    date: new Date("2022-03-12"),
    signups: [],
  },
];

type AdminScheduleSignup = {
  startTime: Date;
  endTime: Date;
  volunteer?: string;
  userId?: string;
};

type AdminScheduleDay = {
  date: Date;
  signups: AdminScheduleSignup[];
};

type AdminScheduleTableProps = {
  schedule: AdminScheduleDay[];
};

const AdminScheduleTable = ({
  schedule,
}: AdminScheduleTableProps): React.ReactElement => {
  // Keep track of the schedule as a state to sort the schedule on useEffect.
  const [adminSchedule, setAdminSchedule] = React.useState<AdminScheduleDay[]>(
    schedule,
  );

  useEffect(() => {
    // Sort the schedule by date
    const sortedSchedule = adminSchedule.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
    setAdminSchedule(sortedSchedule);
  }, [adminSchedule]);

  console.log(adminSchedule);

  return (
    <Table variant="brand">
      <col style={{ width: "30%" }} />
      <col style={{ width: "40%" }} />
      <col style={{ width: "30%" }} />
      <Tbody>
        {adminSchedule.map((day) => {
          return (
            <>
              <AdminScheduleTableDate
                key={day.date.toDateString()}
                date={day.date}
              />
              {day.signups.map((signup: AdminScheduleSignup, i) => (
                <AdminScheduleTableRow
                  key={`${signup.userId}-${i}`}
                  volunteer={signup.volunteer}
                  postingStart={signup.startTime}
                  postingEnd={signup.endTime}
                />
              ))}
            </>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default AdminScheduleTable;

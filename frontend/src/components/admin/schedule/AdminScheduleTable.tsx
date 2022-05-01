import React, { Fragment } from "react";
import {
  Table,
  Tbody,
  Box,
  Flex,
  Button,
  Select,
  Spacer,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import moment from "moment";
import AdminScheduleTableDate from "./AdminScheduleTableDate";
import AdminScheduleTableRow from "./AdminScheduleTableRow";
import { getWeekDiff } from "../../../utils/DateTimeUtils";

// Example test data for the AdminScheduleTable component.
export const TableTestData = [
  {
    date: new Date("2022-03-06"),
    signups: [
      {
        startTime: new Date("2022-03-06 10:00:00"),
        endTime: new Date("2022-03-06 11:00:00"),
        volunteer: {
          name: "Lambert Liu",
          userId: "1",
        },
      },
      {
        startTime: new Date("2022-03-06 15:00:00"),
        endTime: new Date("2022-03-06 17:00:00"),
      },
    ],
  },
  {
    date: new Date("2022-03-07"),
    signups: [],
  },
  {
    date: new Date("2022-03-08"),
    signups: [
      {
        startTime: new Date("2022-03-08 10:00:00"),
        endTime: new Date("2022-03-08 11:00:00"),
        volunteer: {
          name: "Lambert Liu",
          userId: "1",
        },
      },
    ],
  },
  {
    date: new Date("2022-03-09"),
    signups: [],
  },
  {
    date: new Date("2022-03-10"),
    signups: [
      {
        startTime: new Date("2022-03-10 14:00:00"),
        endTime: new Date("2022-03-10 16:00:00"),
        volunteer: {
          name: "Brian Tu",
          userId: "69",
        },
      },
      {
        startTime: new Date("2022-03-10 16:00:00"),
        endTime: new Date("2022-03-10 16:30:00"),
      },
      {
        startTime: new Date("2022-03-10 19:00:00"),
        endTime: new Date("2022-03-10 21:30:00"),
        volunteer: {
          name: "Albert Lai",
          userId: "420",
        },
      },
    ],
  },
  {
    date: new Date("2022-03-11"),
    signups: [
      {
        startTime: new Date("2022-03-11 11:00:00"),
        endTime: new Date("2022-03-11 13:00:00"),
        volunteer: {
          name: "Albert Lai",
          userId: "420",
        },
      },
    ],
  },
  {
    date: new Date("2022-03-12"),
    signups: [],
  },
];

export type AdminScheduleSignup = {
  startTime: Date;
  endTime: Date;
  volunteer?: { name: string; userId: string };
};

export type AdminScheduleDay = {
  date: Date;
  signups: AdminScheduleSignup[];
};

export type AdminScheduleTableProps = {
  // The schedule prop should be sorted by date in ascending order.
  startDate: Date;
  endDate: Date;
  schedule: AdminScheduleDay[];
};

const AdminScheduleTable = ({
  startDate,
  endDate,
  schedule,
}: AdminScheduleTableProps): React.ReactElement => {
  // start/end date is from schedule
  // const startDate = moment(schedule.date).startOf("month");
  // const endDate = moment(schedule.date).endOf("month");

  const [currentWeek, setWeek] = React.useState(
    moment(startDate).startOf("week").toDate(),
  );
  return (
    <Box
      borderWidth="1px"
      borderColor="background.dark"
      bgColor="white"
      width="100%"
    >
      <Flex alignContent="center" px={25} py={25}>
        <Button
          disabled={getWeekDiff(startDate, currentWeek) === 0}
          onClick={() =>
            setWeek(moment(currentWeek).subtract(1, "weeks").toDate())
          }
          variant="link"
          leftIcon={<ChevronLeftIcon />}
        >
          Previous week
        </Button>
        <Spacer />
        <Select
          width="33%"
          _hover={{ bgColor: "gray.100" }}
          value={getWeekDiff(startDate, currentWeek)}
          onChange={(e) =>
            setWeek(
              moment(startDate)
                .startOf("week")
                .add(Number(e.target.value), "weeks")
                .toDate(),
            )
          }
        >
          {Array(getWeekDiff(startDate, endDate) + 1)
            .fill(0)
            .map((_, i) => i)
            .map((week) => {
              const startWeek = moment(startDate)
                .startOf("week")
                .add(week, "weeks")
                .toDate();

              return (
                <option key={week} value={week} color="gray.100">
                  {startWeek.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  to{" "}
                  {moment(startWeek)
                    .endOf("week")
                    .toDate()
                    .toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </option>
              );
            })}
        </Select>
        <Spacer />
        <Button
          disabled={getWeekDiff(currentWeek, endDate) === 0}
          onClick={() => setWeek(moment(currentWeek).add(1, "weeks").toDate())}
          variant="link"
          rightIcon={<ChevronRightIcon />}
        >
          Next week
        </Button>
      </Flex>
      <Table variant="brand">
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <Tbody>
          {schedule.map((day) => {
            return (
              <Fragment key={day.date.toDateString()}>
                <AdminScheduleTableDate
                  key={day.date.toDateString()}
                  date={day.date}
                />
                {day.signups.length > 0 ? (
                  day.signups.map((signup: AdminScheduleSignup, i) => (
                    <AdminScheduleTableRow
                      key={`${signup.volunteer?.userId}-${i}`}
                      volunteer={signup.volunteer}
                      postingStart={signup.startTime}
                      postingEnd={signup.endTime}
                    />
                  ))
                ) : (
                  <AdminScheduleTableRow />
                )}
              </Fragment>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminScheduleTable;

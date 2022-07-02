import React, { Fragment, useState } from "react";
import {
  Table,
  Tbody,
  Box,
  Flex,
  Button,
  Select,
  Spacer,
  TableContainer,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import moment from "moment";
import AdminScheduleTableDate from "./AdminScheduleTableDate";
import AdminScheduleTableRow from "./AdminScheduleTableRow";
import { getWeekDiff } from "../../../utils/DateTimeUtils";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";
import { AdminSchedulingSignupsAndVolunteerResponseDTO } from "../../../types/api/SignupTypes";

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
  startDate: Date;
  endDate: Date;
  // The schedule prop should be sorted by date in ascending order.
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  removeSignup: (shiftId: string, userId: string) => void;
};

const AdminScheduleTable = ({
  startDate,
  endDate,
  shifts,
  removeSignup,
}: AdminScheduleTableProps): React.ReactElement => {
  const [currentWeek, setWeek] = useState<Date>(
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
      <TableContainer>
        <Table variant="brand">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          {Array.from(Array(7).keys()).map((day) => {
            const date = moment(currentWeek)
              .startOf("week")
              .add(day, "days")
              .startOf("day")
              .toDate();
            const shiftsOfDate = shifts.filter(
              (shift) =>
                moment(shift.startTime)
                  .startOf("day")
                  .diff(date, "days", false) === 0,
            );
            const signupsToDisplay: {
              signup: AdminSchedulingSignupsAndVolunteerResponseDTO;
              shiftId: string;
            }[] = shiftsOfDate.flatMap((shift) => {
              return shift.signups
                .filter(
                  ({ status }) =>
                    status === "CONFIRMED" || status === "PUBLISHED",
                )
                .map((signup) => ({ signup, shiftId: shift.id }));
            });

            return (
              <Tbody key={day}>
                <AdminScheduleTableDate key={date.toDateString()} date={date} />
                {signupsToDisplay.length > 0 ? (
                  signupsToDisplay.map(({ signup, shiftId }, i) => (
                    <AdminScheduleTableRow
                      key={`${signup.volunteer.id}-${i}`}
                      volunteer={{
                        name: `${signup.volunteer.firstName} ${signup.volunteer.lastName}`,
                        userId: signup.volunteer.id,
                      }}
                      postingStart={signup.shiftStartTime}
                      postingEnd={signup.shiftEndTime}
                      numVolunteers={signup.numVolunteers}
                      note={signup.note}
                      shiftId={shiftId}
                      removeSignup={removeSignup}
                    />
                  ))
                ) : (
                  <AdminScheduleTableRow
                    shiftId="0"
                    removeSignup={removeSignup}
                  />
                )}
              </Tbody>
            );
          })}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminScheduleTable;

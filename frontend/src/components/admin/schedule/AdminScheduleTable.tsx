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
import { ShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";
import { SignupsAndVolunteerGraphQLResponseDTO } from "../../../types/api/SignupTypes";

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
  shifts: ShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  cancelShift: (shiftId: string, userId: string) => void;
};

const AdminScheduleTable = ({
  startDate,
  endDate,
  shifts,
  cancelShift,
}: AdminScheduleTableProps): React.ReactElement => {
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
          {shifts
            .filter(
              (shift) =>
                moment(shift.startTime)
                  .add(1, "day")
                  .endOf("week")
                  .diff(
                    moment(currentWeek).add(1, "day").endOf("week"),
                    "days",
                    false,
                  ) === 0,
            )
            .map((shift) => {
              return (
                <Fragment
                  key={`${shift.id}-${new Date(
                    shift.startTime,
                  ).toDateString()}`}
                >
                  <AdminScheduleTableDate
                    key={new Date(shift.startTime).toDateString()}
                    date={new Date(shift.startTime)}
                  />
                  {shift.signups.filter(
                    (signup) => signup.status !== "CANCELED",
                  ).length > 0 ? (
                    shift.signups.map(
                      (signup: SignupsAndVolunteerGraphQLResponseDTO, i) =>
                        signup.status !== "CANCELED" && (
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
                            shiftId={shift.id}
                            cancelShift={cancelShift}
                          />
                        ),
                    )
                  ) : (
                    <AdminScheduleTableRow
                      shiftId={shift.id}
                      cancelShift={cancelShift}
                    />
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

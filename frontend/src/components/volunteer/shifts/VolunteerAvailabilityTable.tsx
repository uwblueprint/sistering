import {
  Button,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import moment from "moment";
import NoShiftsAvailableTableRow from "./NoShiftsAvailableTableRow";
import VolunteerAvailabilityTableRow from "./VolunteerAvailabilityTableRow";
import { getWeekDiff } from "../../../utils/DateTimeUtils";

type VolunteerAvailabilityTableProps = { postingId: number };

// Temp type
type Shift = {
  startTime: Date;
  endTime: Date;
};

const VolunteerAvailabilityTable = ({
  postingId,
}: VolunteerAvailabilityTableProps): React.ReactElement => {
  // Side note: I think we should try to avoid doing queries in table components when avbailable03
  // Query to get some posting

  // We assume that we have some posting
  // we generate an item in the the headers menu for each week between start and end state

  // Sample data
  const postingStartDate = new Date(
    new Date().setDate(new Date().getDate() - 14),
  );

  const postingEndDate = new Date(
    new Date().setDate(new Date().getDate() + 14),
  );

  // Maybe put under use effect
  const postingStartWeek = new Date(
    new Date().setDate(postingStartDate.getDate() - postingStartDate.getDay()),
  );

  const postingShifts: Shift[] = [
    {
      startTime: new Date(),
      endTime: new Date(Date.now() + 2.25 * 1000 * 60 * 60),
    },
    {
      startTime: new Date(Date.now() + 3 * 1000 * 60 * 60),
      endTime: new Date(Date.now() + 4 * 1000 * 60 * 60),
    },
    {
      startTime: new Date(
        new Date(Date.now() + 2 * 1000 * 60 * 60).setDate(
          new Date().getDate() + 1,
        ),
      ),
      endTime: new Date(
        new Date(Date.now() + 2.5 * 1000 * 60 * 60).setDate(
          new Date().getDate() + 1,
        ),
      ),
    },
  ];
  // End of sample data

  const [currentWeek, setWeek] = React.useState(
    moment(postingStartWeek).startOf("week").toDate(),
  );
  const [shifts, setShifts] = React.useState(postingShifts);

  return (
    <>
      <Flex>
        <Button
          disabled={getWeekDiff(postingStartDate, currentWeek) === 0}
          onClick={() =>
            setWeek(moment(currentWeek).subtract(1, "weeks").toDate())
          }
        >
          Previous week
        </Button>
        <Select
          defaultValue={0}
          onChange={(e) =>
            setWeek(
              moment(postingStartDate)
                .startOf("week")
                .add(Number(e.target.value), "weeks")
                .toDate(),
            )
          }
        >
          {Array(getWeekDiff(postingStartDate, postingEndDate) + 1)
            .fill(0)
            .map((_, i) => i)
            .map((week) => {
              const startWeek = moment(postingStartDate)
                .startOf("week")
                .add(week, "weeks")
                .toDate();

              return (
                <option key={week} value={week}>
                  {startWeek.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
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

        <Button
          disabled={getWeekDiff(currentWeek, postingEndDate) === 0}
          onClick={() => setWeek(moment(currentWeek).add(1, "weeks").toDate())}
        >
          Next week
        </Button>
      </Flex>
      <Table variant="striped" colorScheme="teal" w="100%">
        {Array.from(Array(7).keys()).map((day) => {
          const date = moment(currentWeek).add(day, "days").toDate();

          return (
            <Tbody key={day}>
              <Tr>
                <Td bgColor="background.light">
                  <Text textStyle="body-bold">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Td>
              </Tr>
              {shifts.filter(
                (shift) =>
                  moment(shift.startTime).diff(date, "days", false) === 0,
              ).length < 1 ? (
                <Tr>
                  <Td>
                    <NoShiftsAvailableTableRow />
                  </Td>
                </Tr>
              ) : (
                shifts
                  .filter(
                    (shift) =>
                      moment(shift.startTime).diff(date, "days", false) === 0,
                  )
                  .map((shift, index) => {
                    return (
                      <Tr key={`${day}-${index}`}>
                        <Td p={0}>
                          <VolunteerAvailabilityTableRow
                            start={shift.startTime}
                            end={shift.endTime}
                          />
                        </Td>
                      </Tr>
                    );
                  })
              )}
            </Tbody>
          );
        })}
      </Table>
    </>
  );
};

export default VolunteerAvailabilityTable;

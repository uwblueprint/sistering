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

  const [currentWeek, setWeek] = React.useState(postingStartWeek);
  const [shifts, setShifts] = React.useState(postingShifts);

  console.log(postingStartDate);
  console.log(postingEndDate);
  console.log(
    Math.ceil(
      Math.abs(postingEndDate.getTime() - postingStartWeek.getTime()) /
        (1000 * 3600 * 24),
    ),
  );

  return (
    <>
      <Flex>
        <Button
          disabled={currentWeek === postingStartWeek}
          onClick={() =>
            setWeek(new Date(new Date().setDate(currentWeek.getDate() - 7)))
          }
        >
          Previous week
        </Button>
        <Select
          defaultValue={0}
          onChange={(e) =>
            setWeek(
              new Date(
                new Date().setDate(
                  postingStartWeek.getDate() -
                    postingStartWeek.getDay() +
                    7 * Number(e.target.value),
                ),
              ),
            )
          }
        >
          {Array(
            Math.ceil(
              Math.ceil(
                Math.abs(
                  postingEndDate.getTime() - postingStartWeek.getTime(),
                ) /
                  (1000 * 3600 * 24),
              ) / 7,
            ),
          )
            .fill(0)
            .map((_, i) => i)
            .map((week) => {
              const startWeek = new Date(
                new Date().setDate(
                  postingStartDate.getDate() -
                    postingStartDate.getDay() +
                    7 * week,
                ),
              );
              return (
                <option key={week} value={week}>
                  {startWeek.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(
                    new Date(startWeek).setDate(startWeek.getDate() + 6),
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              );
            })}
        </Select>

        <Button
          disabled={
            new Date(
              new Date().setDate(currentWeek.getDate() - currentWeek.getDay()),
            ) ===
            new Date(
              new Date().setDate(
                postingEndDate.getDate() - postingEndDate.getDay(),
              ),
            )
          }
          onClick={() =>
            setWeek(new Date(new Date().setDate(currentWeek.getDate() + 7)))
          }
        >
          Next week
        </Button>
      </Flex>
      <Table variant="striped" colorScheme="teal" w="100%">
        {Array.from(Array(7).keys()).map((day) => {
          const date = new Date(
            new Date(currentWeek).setDate(currentWeek.getDate() + day),
          );

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

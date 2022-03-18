import {
  Box,
  Button,
  Flex,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import moment from "moment";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ShiftDTO, ShiftResponseDTO } from "../../../types/api/ShiftTypes";
import NoShiftsAvailableTableRow from "./NoShiftsAvailableTableRow";
import VolunteerAvailabilityTableRow from "./VolunteerAvailabilityTableRow";
import { getWeekDiff } from "../../../utils/DateTimeUtils";

type VolunteerAvailabilityTableProps = {
  postingShifts: ShiftResponseDTO[];
  postingStartDate: Date;
  postingEndDate: Date;
  selectedShifts: ShiftDTO[];
  setSelectedShifts: React.Dispatch<React.SetStateAction<ShiftDTO[]>>;
};

const VolunteerAvailabilityTable = ({
  postingShifts,
  postingStartDate,
  postingEndDate,
  selectedShifts,
  setSelectedShifts,
}: VolunteerAvailabilityTableProps): React.ReactElement => {
  // Side note: I think we should try to avoid doing queries in table components when avbailable03
  // Query to get some posting
  // We assume that we have some posting
  // we generate an item in the the headers menu for each week between start and end state

  const [currentWeek, setWeek] = React.useState(
    moment(postingStartDate).startOf("week").toDate(),
  );
  return (
    <Box
      bgColor="white"
      borderRadius="12px"
      border="1px"
      borderColor="background.dark"
    >
      <Flex alignContent="center" px={25} py={25}>
        <Button
          disabled={getWeekDiff(postingStartDate, currentWeek) === 0}
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
          value={getWeekDiff(postingStartDate, currentWeek)}
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
          disabled={getWeekDiff(currentWeek, postingEndDate) === 0}
          onClick={() => setWeek(moment(currentWeek).add(1, "weeks").toDate())}
          variant="link"
          rightIcon={<ChevronRightIcon />}
        >
          Next week
        </Button>
      </Flex>
      <Table variant="stripe" w="100%">
        {Array.from(Array(7).keys()).map((day) => {
          const date = moment(currentWeek)
            .startOf("week")
            .add(day, "days")
            .startOf("day")
            .toDate();
          const shiftsOfDate = postingShifts.filter(
            (shift) =>
              moment(shift.startTime)
                .startOf("day")
                .diff(date, "days", false) === 0,
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
              {shiftsOfDate.length < 1 ? (
                <Tr>
                  <Td>
                    <NoShiftsAvailableTableRow />
                  </Td>
                </Tr>
              ) : (
                shiftsOfDate.map((shift, index) => {
                  return (
                    <Tr key={`${day}-${index}`}>
                      <Td p={0}>
                        <VolunteerAvailabilityTableRow
                          shift={shift}
                          selectedShifts={selectedShifts}
                          setSelectedShifts={setSelectedShifts}
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
    </Box>
  );
};

export default VolunteerAvailabilityTable;

import { Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";
import moment from "moment";
import { ShiftResponseDTO, TimeBlock } from "../../../types/api/ShiftTypes";
import NoShiftsAvailableTableRow from "./NoShiftsAvailableTableRow";
import VolunteerAvailabilityTableRow from "./VolunteerAvailabilityTableRow";

type VolunteerAvailabilityTableProps = { postingShifts: ShiftResponseDTO[] };

const VolunteerAvailabilityTable = ({
  postingShifts,
}: VolunteerAvailabilityTableProps): React.ReactElement => {
  // Side note: I think we should try to avoid doing queries in table components when avbailable03
  // Query to get some posting

  // Sample data
  const current = new Date();
  const postingStartWeek = new Date(
    current.setDate(current.getDate() - current.getDay()),
  );

  const [currentWeek, setWeek] = React.useState(postingStartWeek);
  const [shifts, setShifts] = React.useState(postingShifts);

  return (
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
  );
};

export default VolunteerAvailabilityTable;

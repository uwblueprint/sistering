import { Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import NoShiftsAvailableTableRow from "./NoShiftsAvailableTableRow";
import { ShiftSignupPostingResponseDTO } from "../../../types/api/ShiftSignupTypes";
import VolunteerUpcomingShiftsTableRow from "./VolunteerUpcomingShiftsTableRow";

type VolunteerUpcomingShiftsTableProps = {
  shifts: ShiftSignupPostingResponseDTO[];
};

const VolunteerUpcomingShiftsTable = ({
  shifts,
}: VolunteerUpcomingShiftsTableProps): React.ReactElement => {
  const [orderedDates, setOrderedDates] = useState<Date[]>(
    shifts.map((shift) => new Date(shift.shiftStartTime)).sort(),
  );

  useEffect(() => {
    setOrderedDates(
      shifts.map((shift) => new Date(shift.shiftStartTime)).sort(),
    );
  }, [shifts]);

  return (
    <Table variant="brand">
      {/* We should iterate over all ordered dates */}
      {orderedDates.map((date) => {
        const shiftsOfDate = shifts.filter((shift) =>
          moment(shift.shiftStartTime).isSame(moment(date), "day"),
        );

        return (
          <Tbody key={date.getTime()}>
            <Tr bgColor="background.light">
              <Td>
                <Text textStyle="body-bold">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Td>
              <Td />
              <Td />
            </Tr>
            {shifts.length < 1 ? (
              <Tr>
                <Td>
                  <NoShiftsAvailableTableRow />
                </Td>
              </Tr>
            ) : (
              shiftsOfDate.map((shift, index) => {
                return (
                  <VolunteerUpcomingShiftsTableRow
                    key={`${shift.shiftId}-${date.getTime()}-${index}`}
                    postingName={shift.postingTitle}
                    postingId={shift.postingId}
                    startTime={shift.shiftStartTime}
                    endTime={shift.shiftEndTime}
                  />
                );
              })
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default VolunteerUpcomingShiftsTable;

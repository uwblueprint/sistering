import React from "react";
import { Text, VStack } from "@chakra-ui/react";
import { ShiftSignupPostingResponseDTO } from "../../../../types/api/ShiftSignupTypes";
import VolunteerShiftsRow from "./VolunteerShiftsRow";
import NoVolunteerShiftsRow from "./NoVolunteerShiftsRow";

type VolunteerShiftsTableProps = {
  firstName: string;
  shifts: ShiftSignupPostingResponseDTO[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  firstName,
  shifts,
}: VolunteerShiftsTableProps): React.ReactElement => {
  return (
    <VStack
      w="full"
      h="full"
      spacing={0}
      borderLeft="1px"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <VStack
        spacing="0px"
        w="full"
        px="32px"
        py="16px"
        alignItems="flex-start"
        borderTop="1px"
        borderBottom="1px"
        borderColor="background.dark"
      >
        <Text textStyle="body-bold">Requested Shifts</Text>
      </VStack>

      <VStack w="full" spacing={0} overflow="auto">
        {shifts?.filter((shift) => shift.status === "PENDING").length > 0 ? (
          shifts
            ?.filter((shift) => shift.status === "PENDING")
            .map((shift, i) => {
              return (
                <VolunteerShiftsRow
                  key={i}
                  postingTitle={shift.postingTitle}
                  shiftStartTime={shift.shiftStartTime}
                  shiftEndTime={shift.shiftEndTime}
                  note={shift.note}
                />
              );
            })
        ) : (
          <NoVolunteerShiftsRow firstName={firstName} status="requested" />
        )}
      </VStack>

      <VStack
        spacing="0px"
        w="full"
        px="32px"
        py="16px"
        alignItems="flex-start"
        borderTop="1px"
        borderBottom="1px"
        borderColor="background.dark"
      >
        <Text textStyle="body-bold">Scheduled Shifts</Text>
      </VStack>

      <VStack w="full" spacing={0} overflow="auto">
        {shifts?.filter((shift) => shift.status === "CONFIRMED").length > 0 ? (
          shifts
            ?.filter((shift) => shift.status === "CONFIRMED")
            .map((shift, i) => {
              return (
                <VolunteerShiftsRow
                  key={i}
                  postingTitle={shift.postingTitle}
                  shiftStartTime={shift.shiftStartTime}
                  shiftEndTime={shift.shiftEndTime}
                  note={shift.note}
                />
              );
            })
        ) : (
          <NoVolunteerShiftsRow firstName={firstName} status="scheduled" />
        )}
      </VStack>
    </VStack>
  );
};

export default VolunteerShiftsTable;

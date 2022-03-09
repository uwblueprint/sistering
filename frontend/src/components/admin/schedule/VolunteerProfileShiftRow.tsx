import React from "react";
import { Text, Box, VStack } from "@chakra-ui/react";
import {
  formatDateStringYear,
  formatTimeHourMinutes,
} from "../../../utils/DateTimeUtils";

type VolunteerProfileShiftRowProps = {
  roleTitle: string;
  startDateTime: Date;
  endDateTime: Date;
  notes: string;
};
const VolunteerProfileShiftRow = ({
  roleTitle,
  startDateTime,
  endDateTime,
  notes,
}: VolunteerProfileShiftRowProps): React.ReactElement => {
  return (
    <Box borderWidth="1px" borderColor="#e5e5e5">
      <VStack
        justifyContent="start"
        align="start"
        py="12px"
        px="32px"
        spacing={0}
      >
        <Text textStyle="caption" fontWeight="semibold">
          {roleTitle}
        </Text>
        <Text textStyle="caption">
          {`${formatDateStringYear(
            startDateTime.toString(),
          )} | ${formatTimeHourMinutes(startDateTime)} -
            ${formatTimeHourMinutes(endDateTime)}`}
        </Text>
        <Text textStyle="caption" color="gray">
          {notes}
        </Text>
      </VStack>
    </Box>
  );
};

export default VolunteerProfileShiftRow;

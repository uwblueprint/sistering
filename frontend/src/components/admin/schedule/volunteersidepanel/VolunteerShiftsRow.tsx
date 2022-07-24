import React from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  formatDateStringYearAbbrWeekday,
  formatTimeHourMinutes,
  getUTCDateForDateTimeString,
} from "../../../../utils/DateTimeUtils";

type VolunteerShiftsRowProps = {
  postingTitle: string;
  shiftStartTime: string;
  shiftEndTime: string;
  note: string;
};

const VolunteerShiftsRow: React.FC<VolunteerShiftsRowProps> = ({
  postingTitle,
  shiftStartTime,
  shiftEndTime,
  note,
}: VolunteerShiftsRowProps): React.ReactElement => {
  return (
    <Box
      w="full"
      pl="32px"
      pr="20px"
      pb="12px"
      pt="12px"
      bg="white"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <Text textStyle="body-regular" fontSize="14px" fontWeight="600">
        {postingTitle}
      </Text>

      <Text textStyle="body-regular" fontSize="14px">
        {formatDateStringYearAbbrWeekday(shiftStartTime)} |{" "}
        {formatTimeHourMinutes(getUTCDateForDateTimeString(shiftStartTime))} -{" "}
        {formatTimeHourMinutes(getUTCDateForDateTimeString(shiftEndTime))}
      </Text>

      {note ? (
        <Text textStyle="body-regular" fontSize="14px" color="text.gray">
          Note: &quot;{note}&quot;
        </Text>
      ) : null}
    </Box>
  );
};

export default VolunteerShiftsRow;

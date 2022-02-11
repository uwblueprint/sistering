import { Box, Checkbox, Flex, Input, Spacer } from "@chakra-ui/react";
import React from "react";
import {
  convertToAmPm,
  elapsedHours,
  totalMinutes,
} from "../../../utils/TimeUtil";

type VolunteerAvailabilityTableRowProps = { start: Date; end: Date };

const VolunteerAvailabilityTableRow = ({
  start,
  end,
}: VolunteerAvailabilityTableRowProps): React.ReactElement => {
  return (
    <Flex>
      <Checkbox minWidth={300} mr={170}>
        {convertToAmPm(totalMinutes(start))} -{" "}
        {convertToAmPm(totalMinutes(end))} ({elapsedHours(start, end)} hrs)
      </Checkbox>
      <Input alignContent="flex-end" placeholder="Add note (optional)" />
    </Flex>
  );
};

export default VolunteerAvailabilityTableRow;

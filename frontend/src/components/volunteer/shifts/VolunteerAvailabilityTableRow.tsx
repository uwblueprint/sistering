import {
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import React from "react";
import {
  formatTimeHourMinutes,
  getElapsedHours,
} from "../../../utils/DateTimeUtils";

type VolunteerAvailabilityTableRowProps = { start: Date; end: Date };

const VolunteerAvailabilityTableRow = ({
  start,
  end,
}: VolunteerAvailabilityTableRowProps): React.ReactElement => {
  const [note, setNote] = React.useState("");

  return (
    <Flex>
      <Checkbox minWidth={300} mr={170}>
        {`${formatTimeHourMinutes(start)} -  ${formatTimeHourMinutes(
          end,
        )} (${getElapsedHours(start, end)} hrs)`}
      </Checkbox>
      <InputGroup>
        <Input
          placeholder="Add note (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <InputRightElement
          visibility={note.trim().length > 0 ? "visible" : "hidden"}
        >
          <CheckIcon color="brand.500" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default VolunteerAvailabilityTableRow;

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
  convertToAmPm,
  elapsedHours,
  totalMinutes,
} from "../../../utils/TimeUtil";

type VolunteerAvailabilityTableRowProps = { start: Date; end: Date };

const VolunteerAvailabilityTableRow = ({
  start,
  end,
}: VolunteerAvailabilityTableRowProps): React.ReactElement => {
  const [note, setNote] = React.useState("");

  return (
    <Flex>
      <Checkbox minWidth={300} mr={170}>
        {convertToAmPm(totalMinutes(start))} -{" "}
        {convertToAmPm(totalMinutes(end))} ({elapsedHours(start, end)} hrs)
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

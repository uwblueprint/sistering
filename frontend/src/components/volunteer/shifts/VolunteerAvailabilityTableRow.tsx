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
import { ShiftDTO } from "../../../types/api/ShiftTypes";

type VolunteerAvailabilityTableRowProps = {
  shift: ShiftDTO;
  selectedShifts: ShiftDTO[];
  setSelectedShifts: React.Dispatch<React.SetStateAction<ShiftDTO[]>>;
  start: Date;
  end: Date;
};

const VolunteerAvailabilityTableRow = ({
  shift,
  selectedShifts,
  setSelectedShifts,
  start,
  end,
}: VolunteerAvailabilityTableRowProps): React.ReactElement => {
  const [note, setNote] = React.useState("");
  const [checked, setChecked] = React.useState(selectedShifts.includes(shift));

  return (
    <Flex bgColor={checked ? "purple.50" : undefined} px={25} py={3}>
      <Checkbox
        minWidth={300}
        mr={170}
        isChecked={checked}
        onChange={(event) => {
          if (!checked) {
            setSelectedShifts([...selectedShifts, shift]);
          } else {
            const selected = selectedShifts.filter((s) => s !== shift);
            setSelectedShifts(selected);
          }
          setChecked(event.target.checked);
        }}
      >
        {`${formatTimeHourMinutes(start)} -  ${formatTimeHourMinutes(
          end,
        )} (${getElapsedHours(start, end)} hrs)`}
      </Checkbox>
      <InputGroup>
        <Input
          isDisabled={!checked}
          bg="white"
          placeholder="Add note (optional)"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <InputRightElement
          visibility={note.trim().length > 0 && checked ? "visible" : "hidden"}
        >
          <CheckIcon color="brand.500" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default VolunteerAvailabilityTableRow;

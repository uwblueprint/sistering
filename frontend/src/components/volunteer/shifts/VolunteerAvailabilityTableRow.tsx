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
import { ShiftResponseDTO } from "../../../types/api/ShiftTypes";
import { SignupRequestDTO } from "../../../types/api/SignupTypes";

type VolunteerAvailabilityTableRowProps = {
  shift: ShiftResponseDTO;
  selectedShifts: ShiftResponseDTO[];
  setSelectedShifts: React.Dispatch<React.SetStateAction<ShiftResponseDTO[]>>;
  signupNotes: SignupRequestDTO[];
  setSignupNotes: React.Dispatch<React.SetStateAction<SignupRequestDTO[]>>;
  start: Date;
  end: Date;
};

const VolunteerAvailabilityTableRow = ({
  shift,
  selectedShifts,
  setSelectedShifts,
  signupNotes,
  setSignupNotes,
  start,
  end,
}: VolunteerAvailabilityTableRowProps): React.ReactElement => {
  const [checked, setChecked] = React.useState(selectedShifts.includes(shift));
  const signupNote = React.useMemo(() => {
    const note = signupNotes.find((s) => s.shiftId === shift.id);
    if (note) {
      return note.note;
    }
    return "";
  }, [signupNotes, shift]);

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
          onChange={(event) => {
            const otherNotes = signupNotes.filter(
              (s) => s.shiftId !== shift.id,
            );
            setSignupNotes([
              ...otherNotes,
              {
                shiftId: shift.id,
                note: event.target.value.toString().trim(),
              },
            ]);
          }}
        />
        <InputRightElement
          visibility={signupNote.length > 0 && checked ? "visible" : "hidden"}
        >
          <CheckIcon color="brand.500" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default VolunteerAvailabilityTableRow;

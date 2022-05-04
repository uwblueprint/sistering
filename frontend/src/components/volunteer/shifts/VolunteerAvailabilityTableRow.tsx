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
import { ShiftWithSignupAndVolunteerResponseDTO } from "../../../types/api/ShiftTypes";
import {
  DeleteSignupRequest,
  SignupRequest,
} from "../../../types/api/SignupTypes";

type VolunteerAvailabilityTableRowProps = {
  shift: ShiftWithSignupAndVolunteerResponseDTO;
  selectedShifts: SignupRequest[];
  setSelectedShifts: React.Dispatch<React.SetStateAction<SignupRequest[]>>;
  deleteSignups: DeleteSignupRequest[];
  setDeleteSignups: React.Dispatch<React.SetStateAction<DeleteSignupRequest[]>>;
};

const VolunteerAvailabilityTableRow = ({
  shift,
  selectedShifts,
  setSelectedShifts,
  deleteSignups,
  setDeleteSignups,
}: VolunteerAvailabilityTableRowProps): React.ReactElement => {
  const [checked, setChecked] = React.useState(shift.signups.length > 0);
  const [note, setNote] = React.useState(
    shift.signups.length > 0 ? shift.signups[0].note : "",
  );

  return (
    <Flex bgColor={checked ? "purple.50" : undefined} px={25} py={3}>
      <Checkbox
        minWidth={300}
        mr={170}
        isChecked={checked}
        onChange={(event) => {
          if (!checked) {
            setSelectedShifts([...selectedShifts, { shiftId: shift.id, note }]);
          } else {
            setSelectedShifts(
              selectedShifts.filter((select) => select.shiftId !== shift.id),
            );
            setNote("");
          }
          setDeleteSignups(
            deleteSignups.map((signup) => {
              const newSignup = signup;
              if (newSignup.shiftId === shift.id) {
                newSignup.toDelete = checked;
              }
              return newSignup;
            }),
          );
          setChecked(event.target.checked);
        }}
      >
        {`${formatTimeHourMinutes(shift.startTime)} -  ${formatTimeHourMinutes(
          shift.endTime,
        )} (${getElapsedHours(shift.startTime, shift.endTime)} hrs)`}
      </Checkbox>
      <InputGroup>
        <Input
          isDisabled={!checked}
          bg="white"
          placeholder="Add note (optional)"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
          }}
          onBlur={() => {
            setSelectedShifts(
              selectedShifts.map((select) => {
                if (select.shiftId === shift.id) {
                  const newShift = select;
                  newShift.note = note.trim();
                  return newShift;
                }
                return select;
              }),
            );
          }}
        />
        <InputRightElement
          visibility={note.length > 0 && checked ? "visible" : "hidden"}
        >
          <CheckIcon color="brand.500" />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default VolunteerAvailabilityTableRow;

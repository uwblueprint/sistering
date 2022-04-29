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
import { SignupsAndVolunteerResponseDTO } from "../../../types/api/SignupTypes";

type VolunteerAvailabilityTableRowProps = {
  shift: ShiftWithSignupAndVolunteerResponseDTO;
  selectedShifts: ShiftWithSignupAndVolunteerResponseDTO[];
  setSelectedShifts: React.Dispatch<
    React.SetStateAction<ShiftWithSignupAndVolunteerResponseDTO[]>
  >;
};

const VolunteerAvailabilityTableRow = ({
  shift,
  selectedShifts,
  setSelectedShifts,
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
            // Add new signup
            shift.signups.push({
              shiftId: shift.id,
              note,
            } as SignupsAndVolunteerResponseDTO);
          } else {
            // Remove existing signup
            while (shift.signups.length > 0) {
              shift.signups.pop();
            }
            setNote("");
          }
          // Add push shift into newShifts if not in existing
          const target = selectedShifts.find(
            (select) => select.id === shift.id,
          );
          if (target) {
            const newShiftsWithSignups = selectedShifts.map((select) => {
              if (select.id === shift.id) {
                return shift;
              }
              return select;
            });
            setSelectedShifts(newShiftsWithSignups);
          } else {
            setSelectedShifts([shift, ...selectedShifts]);
          }
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
          onBlur={(event) => {
            // const target = newShifts.filter(
            //   (shiftWithSignup) => shiftWithSignup.id === shift.id,
            // );
            // if (target.length > 0 && target[0].signups.length > 0) {
            //   target[0].signups[0].note = event.target.value.toString().trim();
            // }
            const newShifts = selectedShifts.map((select) => {
              if (select.id === shift.id) {
                const newShift = select;
                newShift.signups[0].note = note;
                return newShift;
              }
              return select;
            });
            setSelectedShifts(newShifts);
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

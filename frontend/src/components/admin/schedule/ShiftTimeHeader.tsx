import React from "react";
import { VStack, Text, Select } from "@chakra-ui/react";
import { formatTimeHourMinutes } from "../../../utils/DateTimeUtils";

type Shift = {
  shiftId: number;
  shiftStartTime: Date;
  shiftEndTime: Date;
};

type ShiftTimeHeaderProps = {
  shifts: Shift[];
  onShiftSelected: (id: number) => void;
};

const ShiftTimeHeader: React.FC<ShiftTimeHeaderProps> = ({
  shifts,
  onShiftSelected,
}: ShiftTimeHeaderProps): React.ReactElement => {
  return (
    <VStack
      spacing="12px"
      px="32px"
      py="16px"
      alignItems="flex-start"
      borderBottom="1px"
      borderLeft="2px"
      borderColor="background.dark"
    >
      <Text textStyle="body-bold">Shift Time</Text>
      <Select
        size="md"
        textStyle="caption"
        onChange={(e) => onShiftSelected(Number(e.target.value))}
      >
        {shifts.map((shift, i) => (
          <option key={i} value={shift.shiftId}>
            {`${formatTimeHourMinutes(
              shift.shiftStartTime,
            )} - ${formatTimeHourMinutes(shift.shiftEndTime)}`}
          </option>
        ))}
      </Select>
    </VStack>
  );
};

export default ShiftTimeHeader;

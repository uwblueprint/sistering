import React from "react";
import { VStack, Text, Select } from "@chakra-ui/react";
import { formatTimeHourMinutes } from "../../../utils/DateTimeUtils";
import { ShiftWithSignupAndVolunteerResponseDTO } from "../../pages/admin/schedule/testData";

type ShiftTimeHeaderProps = {
  shifts: ShiftWithSignupAndVolunteerResponseDTO[];
  onShiftSelected: (id: string) => void;
};

const ShiftTimeHeader: React.FC<ShiftTimeHeaderProps> = ({
  shifts,
  onShiftSelected,
}: ShiftTimeHeaderProps): React.ReactElement => {
  return (
    <VStack
      spacing="12px"
      w="full"
      px="32px"
      py="16px"
      alignItems="flex-start"
      borderTop="1px"
      borderLeft="1px"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <Text textStyle="body-bold">Shift Time</Text>
      <Select
        size="md"
        textStyle="caption"
        onChange={(e) => onShiftSelected(String(e.target.value))}
      >
        {shifts.map((shift, i) => (
          <option key={i} value={shift.id}>
            {`${formatTimeHourMinutes(
              shift.startTime,
            )} - ${formatTimeHourMinutes(shift.endTime)}`}
          </option>
        ))}
      </Select>
    </VStack>
  );
};

export default ShiftTimeHeader;

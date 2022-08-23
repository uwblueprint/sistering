import React from "react";
import { VStack, Text, Select } from "@chakra-ui/react";
import { formatRawTimeHourMinutes } from "../../../utils/DateTimeUtils";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";

type ShiftTimeHeaderProps = {
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  onShiftSelected: (id: string) => void;
  selectedShift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO;
};

const ShiftTimeHeader: React.FC<ShiftTimeHeaderProps> = ({
  shifts,
  onShiftSelected,
  selectedShift,
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
        value={selectedShift?.id ?? shifts[0].id}
      >
        {shifts.map((shift, i) => (
          <option key={i} value={shift.id}>
            {`${formatRawTimeHourMinutes(
              shift.startTime,
            )} - ${formatRawTimeHourMinutes(shift.endTime)}`}
          </option>
        ))}
      </Select>
    </VStack>
  );
};

export default ShiftTimeHeader;

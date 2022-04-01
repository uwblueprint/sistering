import React from "react";
import { VStack, Text, Select } from "@chakra-ui/react";

type ShiftTimeHeaderProps = {
  dateTimes: string[];
  onDateSelected: (date: string) => void;
};

const ShiftTimeHeader: React.FC<ShiftTimeHeaderProps> = ({
  dateTimes,
  onDateSelected,
}: ShiftTimeHeaderProps): React.ReactElement => {
  return (
    <VStack
      spacing="12px"
      px="32px"
      py="16px"
      alignItems="flex-start"
      borderBottom="2px"
      borderLeft="2px"
      borderColor="background.dark"
    >
      <Text textStyle="body-bold">Shift Time</Text>
      <Select size="md" onChange={(e) => onDateSelected(e.target.value)}>
        {dateTimes.map((dateTime, i) => (
          <option value={dateTime} key={i}>
            {dateTime}
          </option>
        ))}
      </Select>
    </VStack>
  );
};

export default ShiftTimeHeader;

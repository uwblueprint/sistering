import React from "react";
import { Tr, Td, Text } from "@chakra-ui/react";

type ScheduledShiftsTrProps = { date: string; time: string };

const ScheduledShiftsTr: React.FC<ScheduledShiftsTrProps> = ({
  date,
  time,
}: ScheduledShiftsTrProps) => {
  return (
    <Tr>
      <Td maxW="120px">
        <Text textStyle="caption" fontSize="14px" fontWeight="medium">
          {date}
        </Text>
      </Td>
      <Td>
        <Text textStyle="caption" fontSize="14px" fontWeight="medium">
          {time}
        </Text>
      </Td>
    </Tr>
  );
};

export default ScheduledShiftsTr;

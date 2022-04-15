import React from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import ShiftTimeHeader from "./ShiftTimeHeader";
import NoShiftsPanel from "../../pages/admin/schedule/NoShiftsPanel";
import { formatDateStringYear } from "../../../utils/DateTimeUtils";

type Shift = {
  shiftId: number;
  shiftStartTime: Date;
  shiftEndTime: Date;
};

type ScheduleSidePanelProps = {
  date: Date;
  shifts: Shift[];
};

const ScheduleSidePanel: React.FC<ScheduleSidePanelProps> = ({
  date,
  shifts,
}: ScheduleSidePanelProps): React.ReactElement => {
  return (
    <VStack
      w="full"
      h="full"
      spacing={0}
      borderLeft="4px"
      borderColor="background.dark"
      alignItems="flex-start"
    >
      <Box
        w="full"
        px="32px"
        py="16px"
        borderBottom="2px"
        borderColor="background.dark"
      >
        <Text textStyle="heading">
          {formatDateStringYear(date.toDateString())}
        </Text>
      </Box>
      {shifts.length ? (
        <ShiftTimeHeader
          shifts={shifts}
          onShiftSelected={(id) => console.log(id)}
        />
      ) : (
        <NoShiftsPanel />
      )}
    </VStack>
  );
};

export default ScheduleSidePanel;

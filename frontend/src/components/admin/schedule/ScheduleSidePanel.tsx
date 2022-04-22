import React from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import { formatDateStringYear } from "../../../utils/DateTimeUtils";

import ShiftTimeHeader from "./ShiftTimeHeader";
import NoShiftsPanel from "../../pages/admin/schedule/NoShiftsPanel";
import AdminScheduleVolunteerTable from "./AdminScheduleVolunteerTable";
import { ShiftWithSignupAndVolunteerResponseDTO } from "../../pages/admin/schedule/testData";

type ScheduleSidePanelProps = {
  shifts: ShiftWithSignupAndVolunteerResponseDTO[];
  selectedShift: ShiftWithSignupAndVolunteerResponseDTO;
  onShiftSelected: (id: string) => void;
  selectAllSignups: () => void;
  updateSignupStatus: (id: string, isChecked: boolean) => void;
};

const ScheduleSidePanel: React.FC<ScheduleSidePanelProps> = ({
  shifts,
  selectedShift,
  onShiftSelected,
  selectAllSignups,
  updateSignupStatus,
}: ScheduleSidePanelProps): React.ReactElement => {
  return (
    <VStack
      w="full"
      h="full"
      spacing={0}
      borderLeft="2px"
      borderColor="background.dark"
      alignItems="flex-start"
    >
      <Box
        w="full"
        px="32px"
        py="16px"
        borderLeft="1px"
        borderBottom="1px"
        borderColor="background.dark"
      >
        <Text textStyle="heading">
          {formatDateStringYear(selectedShift.startTime.toString())}
        </Text>
      </Box>

      {shifts.length ? (
        <>
          <ShiftTimeHeader shifts={shifts} onShiftSelected={onShiftSelected} />
          <AdminScheduleVolunteerTable
            signups={selectedShift.signups}
            selectAllSignups={selectAllSignups}
            updateSignupStatus={updateSignupStatus}
          />
        </>
      ) : (
        <NoShiftsPanel />
      )}
    </VStack>
  );
};

export default ScheduleSidePanel;

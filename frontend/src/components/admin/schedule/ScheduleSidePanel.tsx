import React, { useEffect, useState } from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import { formatDateStringYear } from "../../../utils/DateTimeUtils";

import ShiftTimeHeader from "./ShiftTimeHeader";
import NoShiftsPanel from "../../pages/admin/schedule/NoShiftsPanel";
import AdminScheduleVolunteerTable from "./AdminScheduleVolunteerTable";
import {
  ShiftWithSignupAndVolunteerResponseDTO,
  Signup,
} from "../../pages/admin/schedule/testData";

type ScheduleSidePanelProps = {
  shifts: ShiftWithSignupAndVolunteerResponseDTO[];
  currentlyEditingSignups: Signup[];
  onEditSignupsClick: (signups: Signup[]) => void;
  onSelectAllSignupsClick: () => void;
  onSignupCheckboxClick: (id: string, isChecked: boolean) => void;
};

const ScheduleSidePanel: React.FC<ScheduleSidePanelProps> = ({
  shifts,
  currentlyEditingSignups,
  onEditSignupsClick,
  onSelectAllSignupsClick,
  onSignupCheckboxClick,
}: ScheduleSidePanelProps): React.ReactElement => {
  const [selectedShiftId, setSelectedShiftId] = useState<string>(shifts[0].id);
  const [
    selectedShift,
    setSelectedShift,
  ] = useState<ShiftWithSignupAndVolunteerResponseDTO>(shifts[0]);
  useEffect(() => {
    setSelectedShift(
      shifts.find((shift) => shift.id === selectedShiftId) || shifts[0],
    );
  }, [selectedShiftId]);

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
          <ShiftTimeHeader
            shifts={shifts}
            onShiftSelected={(shiftId: string) => setSelectedShiftId(shiftId)}
          />
          <AdminScheduleVolunteerTable
            signups={selectedShift.signups}
            currentlyEditingSignups={currentlyEditingSignups}
            onEditSignupsClick={onEditSignupsClick}
            onSelectAllSignupsClick={onSelectAllSignupsClick}
            onSignupCheckboxClick={onSignupCheckboxClick}
          />
        </>
      ) : (
        <NoShiftsPanel />
      )}
    </VStack>
  );
};

export default ScheduleSidePanel;

import React, { useState } from "react";
import { VStack, Box, Text, useBoolean } from "@chakra-ui/react";
import { formatDateStringYear } from "../../../utils/DateTimeUtils";

import ShiftTimeHeader from "./ShiftTimeHeader";
import NoShiftsPanel from "../../pages/admin/schedule/NoShiftsPanel";
import AdminScheduleVolunteerTable from "./AdminScheduleVolunteerTable";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";

type ScheduleSidePanelProps = {
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  currentlyEditingShift?: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO;
  onEditSignupsClick: (
    shift?: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => void;
  onSelectAllSignupsClick: () => void;
  onSignupCheckboxClick: (id: string, isChecked: boolean) => void;
};

const ScheduleSidePanel: React.FC<ScheduleSidePanelProps> = ({
  shifts,
  currentlyEditingShift,
  onEditSignupsClick,
  onSelectAllSignupsClick,
  onSignupCheckboxClick,
}: ScheduleSidePanelProps): React.ReactElement => {
  const [
    selectedShift,
    setSelectedShift,
  ] = useState<AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO>(
    shifts[0],
  );
  const [isEditing, setIsEditing] = useBoolean(false);

  const handleEditSaveButtonClick = () => {
    if (!isEditing) {
      onEditSignupsClick(selectedShift);
    }
    setIsEditing.toggle();
  };

  const handleShiftTimeSelect = (selectedShiftId: string) => {
    setSelectedShift(
      shifts.find((shift) => shift.id === selectedShiftId) || shifts[0],
    );
    setIsEditing.off();
  };

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
        py="17px"
        borderLeft="1px"
        borderBottom="1px"
        borderColor="background.dark"
      >
        <Text textStyle="heading">
          {selectedShift
            ? formatDateStringYear(selectedShift.startTime.toString())
            : ""}
        </Text>
      </Box>

      {shifts.length ? (
        <>
          <ShiftTimeHeader
            shifts={shifts}
            onShiftSelected={handleShiftTimeSelect}
          />
          <AdminScheduleVolunteerTable
            signups={selectedShift ? selectedShift.signups : []}
            currentlyEditingShift={currentlyEditingShift}
            onSelectAllSignupsClick={onSelectAllSignupsClick}
            onSignupCheckboxClick={onSignupCheckboxClick}
            isEditing={isEditing}
            onEditSaveClick={handleEditSaveButtonClick}
          />
        </>
      ) : (
        <NoShiftsPanel />
      )}
    </VStack>
  );
};

export default ScheduleSidePanel;

import React from "react";
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
  onSaveSignupsClick: () => Promise<void>;
  submitSignupsLoading: boolean;
  selectedShift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO;
  setSelectedShift: React.Dispatch<
    React.SetStateAction<AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO>
  >;
  isReadOnly: boolean;
  onVolunteerProfileClick: (
    isDisplayingVolunteer: boolean,
    userId: string,
  ) => void;
};

const ScheduleSidePanel: React.FC<ScheduleSidePanelProps> = ({
  shifts,
  currentlyEditingShift,
  onEditSignupsClick,
  onSelectAllSignupsClick,
  onSignupCheckboxClick,
  onSaveSignupsClick,
  submitSignupsLoading,
  selectedShift,
  setSelectedShift,
  isReadOnly,
  onVolunteerProfileClick,
}: ScheduleSidePanelProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useBoolean(false);

  const handleEditSaveButtonClick = async () => {
    if (!isEditing) {
      onEditSignupsClick(selectedShift);
    } else {
      await onSaveSignupsClick();
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
            selectedShift={selectedShift}
          />
          <AdminScheduleVolunteerTable
            signups={selectedShift ? selectedShift.signups : []}
            currentlyEditingShift={currentlyEditingShift}
            onSelectAllSignupsClick={onSelectAllSignupsClick}
            onSignupCheckboxClick={onSignupCheckboxClick}
            isEditing={isEditing}
            onEditSaveClick={handleEditSaveButtonClick}
            submitSignupsLoading={submitSignupsLoading}
            isReadOnly={isReadOnly}
            onVolunteerProfileClick={onVolunteerProfileClick}
          />
        </>
      ) : (
        <NoShiftsPanel />
      )}
    </VStack>
  );
};

export default ScheduleSidePanel;

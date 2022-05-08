import React, { useState, useEffect } from "react";
import { Flex, VStack, Text, Button, Spacer } from "@chakra-ui/react";

import AdminScheduleVolunteerRow from "./AdminScheduleVolunteerRow";
import { AdminSchedulingSignupsAndVolunteerResponseDTO } from "../../../types/api/SignupTypes";

type AdminScheduleVolunteerTableProps = {
  signups: AdminSchedulingSignupsAndVolunteerResponseDTO[];
  currentlyEditingShift: AdminSchedulingSignupsAndVolunteerResponseDTO[];
  onSelectAllSignupsClick: () => void;
  onSignupCheckboxClick: (id: string, isChecked: boolean) => void;
  isEditing: boolean;
  onEditSaveClick: () => void;
};

const AdminScheduleVolunteerTable = ({
  signups,
  currentlyEditingShift,
  onSelectAllSignupsClick,
  onSignupCheckboxClick,
  isEditing,
  onEditSaveClick,
}: AdminScheduleVolunteerTableProps): React.ReactElement => {
  const [signupsToDisplay, setSignupsToDisplay] = useState<
    AdminSchedulingSignupsAndVolunteerResponseDTO[]
  >(signups);

  useEffect(() => {
    if (isEditing) setSignupsToDisplay(currentlyEditingShift);
    else setSignupsToDisplay(signups);
  }, [isEditing, signups, currentlyEditingShift]);

  return (
    <VStack
      w="full"
      h="full"
      spacing={0}
      borderTop="1px"
      borderLeft="1px"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <VStack
        w="full"
        px="32px"
        py="12px"
        spacing="10px"
        borderBottom="1px"
        borderColor="background.dark"
      >
        <Flex w="full" alignItems="center">
          <Text textStyle="body-bold">Available Volunteers</Text>
          <Spacer />
          <Button
            variant="outline"
            w="64px"
            h="24px"
            px="18px"
            fontSize="12px"
            lineHeight="100%"
            onClick={onEditSaveClick}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </Flex>
        <Flex w="full" alignItems="center">
          <Text
            textStyle="button-semibold"
            fontSize="12px"
            color="violet"
            textDecor="underline"
            cursor="pointer"
            onClick={onSelectAllSignupsClick}
          >
            Select All
          </Text>
          <Spacer />
          <Text textStyle="caption" fontSize="12px">
            Volunteers per shift: {signups[0] ? signups[0].numVolunteers : ""}
          </Text>
        </Flex>
      </VStack>
      <VStack w="full" spacing={0} overflow="auto">
        {signupsToDisplay.map((signup, i) => (
          <AdminScheduleVolunteerRow
            key={i}
            volunteerID={signup.volunteer.id}
            volunteerName={`${signup.volunteer.firstName} ${signup.volunteer.lastName}`}
            note={signup.note}
            isConfirmed={
              signup.status === "CONFIRMED" || signup.status === "PUBLISHED"
            }
            isDisabled={!isEditing}
            onSignupCheckboxClick={onSignupCheckboxClick}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default AdminScheduleVolunteerTable;

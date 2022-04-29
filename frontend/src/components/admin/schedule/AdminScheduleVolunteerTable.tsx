import React, { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  Text,
  Button,
  Spacer,
  useBoolean,
} from "@chakra-ui/react";

import AdminScheduleVolunteerRow from "./AdminScheduleVolunteerRow";
import { SignupsAndVolunteerGraphQLResponseDTO } from "../../../types/api/SignupTypes";

type AdminScheduleVolunteerTableProps = {
  signups: SignupsAndVolunteerGraphQLResponseDTO[];
  currentlyEditingSignups: SignupsAndVolunteerGraphQLResponseDTO[];
  onEditSignupsClick: (
    signups: SignupsAndVolunteerGraphQLResponseDTO[],
  ) => void;
  onSelectAllSignupsClick: () => void;
  onSignupCheckboxClick: (id: string, isChecked: boolean) => void;
};

const AdminScheduleVolunteerTable = ({
  signups,
  currentlyEditingSignups,
  onEditSignupsClick,
  onSelectAllSignupsClick,
  onSignupCheckboxClick,
}: AdminScheduleVolunteerTableProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useBoolean(false);
  const [signupsToDisplay, setSignupsToDisplay] = useState<
    SignupsAndVolunteerGraphQLResponseDTO[]
  >(signups);
  useEffect(() => {
    if (isEditing) setSignupsToDisplay(currentlyEditingSignups);
    else setSignupsToDisplay(signups);
  }, [isEditing, signups, currentlyEditingSignups]);

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
            onClick={() => {
              if (!isEditing) onEditSignupsClick(signups);
              setIsEditing.toggle();
            }}
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

import React from "react";
import {
  Flex,
  VStack,
  Text,
  Button,
  Spacer,
  useBoolean,
} from "@chakra-ui/react";

import AdminScheduleVolunteerRow from "./AdminScheduleVolunteerRow";
import { ShiftSignupStatus } from "../../../types/api/ShiftSignupStatus";

export type Signup = {
  volunteerId: string;
  volunteerName: string;
  note: string;
  status: ShiftSignupStatus;
};

type AdminScheduleVolunteerTableProps = {
  signups: Signup[];
  selectAll: () => void;
  updateSignupStatus: (id: string, isChecked: boolean) => void;
};

const AdminScheduleVolunteerTable = ({
  signups,
  selectAll,
  updateSignupStatus,
}: AdminScheduleVolunteerTableProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useBoolean(true);
  return (
    <VStack w="full" spacing={0}>
      <VStack
        w="full"
        px="32px"
        py="12px"
        spacing="10px"
        borderBottom="2px"
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
            onClick={setIsEditing.toggle}
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
            onClick={selectAll}
          >
            Select All
          </Text>
          <Spacer />
          <Text textStyle="caption" fontSize="12px">
            Volunteers per shift: {signups.length}
          </Text>
        </Flex>
      </VStack>
      {signups.map((signup, i) => (
        <AdminScheduleVolunteerRow
          key={i}
          volunteerID={signup.volunteerId}
          volunteerName={signup.volunteerName}
          note={signup.note}
          isConfirmed={
            signup.status === "CONFIRMED" || signup.status === "PUBLISHED"
          }
          isDisabled={!isEditing}
          updateSignupStatus={updateSignupStatus}
        />
      ))}
    </VStack>
  );
};

export default AdminScheduleVolunteerTable;

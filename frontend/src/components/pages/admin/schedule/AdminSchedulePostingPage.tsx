import { Flex, Box, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import AdminScheduleVolunteerTable, {
  Signup,
} from "../../../admin/schedule/AdminScheduleVolunteerTable";

const AdminSchedulePostingPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [signups, setSignups] = useState<Signup[]>([
    {
      volunteerId: "1",
      volunteerName: "Brian Tu",
      note: "hire me",
      status: "PENDING",
    },
    {
      volunteerId: "2",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "3",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "4",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "5",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "6",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "7",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "8",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "9",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "10",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
  ]);
  const selectAllSignups = () => {
    setSignups(
      signups.map((signup) => {
        return {
          ...signup,
          status: signup.status !== "PUBLISHED" ? "CONFIRMED" : "PUBLISHED",
        };
      }),
    );
  };
  const updateSignupStatus = (volunteerId: string, isChecked: boolean) => {
    const index = signups.findIndex(
      (signup) => signup.volunteerId === volunteerId,
    );
    if (index > 0) {
      const updatedSignups = [...signups];
      updatedSignups[index].status = isChecked ? "CONFIRMED" : "PENDING";
      setSignups(updatedSignups);
    }
  };

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      <VStack spacing={4}>
        <Text>Hello! 👋 This is a placeholder page.</Text>
        <Text>The id is: {id}</Text>
      </VStack>
      <Box w="400px" overflow="hidden">
        <AdminScheduleVolunteerTable
          signups={signups}
          numVolunteers={4}
          selectAll={selectAllSignups}
          updateSignupStatus={updateSignupStatus}
        />
      </Box>
    </Flex>
  );
};

export default AdminSchedulePostingPage;

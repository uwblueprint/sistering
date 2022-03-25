import { Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { useParams } from "react-router-dom";

const AdminSchedulePostingPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  return (
    <Flex
      flexDir="column"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={4}>
        <Text>Hello! 👋 This is a placeholder page.</Text>
        <Text>The id is: {id}</Text>
      </VStack>
    </Flex>
  );
};

export default AdminSchedulePostingPage;

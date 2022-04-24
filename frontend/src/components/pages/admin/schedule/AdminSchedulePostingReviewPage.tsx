import { Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { useParams } from "react-router-dom";
import ErrorModal from "../../../common/ErrorModal";

const AdminSchedulePostingReviewPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const error = false; // TODO: replace variable with error from GQL query or mutation
  return (
    <Flex
      flexDir="column"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      {error && <ErrorModal />}
      <VStack spacing={4}>
        <Text>Hello! 👋 This is a placeholder page.</Text>
        <Text>The id is: {id}</Text>
      </VStack>
    </Flex>
  );
};

export default AdminSchedulePostingReviewPage;

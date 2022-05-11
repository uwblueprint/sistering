import React from "react";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";

const Loading: React.FC = () => {
  return (
    <Center h="100vh">
      <Box textAlign="center">
        <Spinner
          thickness="6px"
          speed="0.65s"
          emptyColor="background.dark"
          color="violet"
          size="xl"
        />
        <Text pt="16px" fontWeight="bold">
          Loading data...
        </Text>
      </Box>
    </Center>
  );
};

export default Loading;

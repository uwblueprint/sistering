import React from "react";
import { Text, Box, VStack } from "@chakra-ui/react";

type EmptyPostingCardProps = {
  type: string;
};

const EmptyPostingCard = ({ type }: EmptyPostingCardProps): JSX.Element => {
  return (
    <Box
      borderRadius="8px"
      borderWidth="2px"
      borderColor="background.dark"
      bg="background.white"
      mb="36px"
    >
      <VStack justify="center" align="center" height="121px">
        <Box>
          <Text textStyle="body-regular" textAlign="center" my="auto">
            There are no{" "}
            {type === "event" ? "events" : "regular volunteer opportunities"} at
            this time. Please check back soon.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default EmptyPostingCard;

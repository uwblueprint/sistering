import React from "react";
import { Text, Box, VStack } from "@chakra-ui/react";

type EmptyPostingCardProps = {
  type: "event" | "opportunity";
};

const EmptyPostingCard = ({
  type,
}: EmptyPostingCardProps): React.ReactElement => {
  return (
    <Box
      borderRadius="8px"
      borderWidth="2px"
      borderColor="background.dark"
      bg="background.white"
      height="121px"
    >
      <VStack justify="center" align="center" h="full">
          <Text
            textStyle="body-regular"
            textAlign="center"
            my="auto"
            color="text.gray"
          >
            There are no{" "}
            {type === "event" ? "events" : "regular volunteer opportunities"} at
            this time. Please check back soon.
          </Text>
      </VStack>
    </Box>
  );
};

export default EmptyPostingCard;

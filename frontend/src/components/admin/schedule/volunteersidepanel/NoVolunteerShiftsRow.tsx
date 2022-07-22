import React from "react";
import { Box, Text } from "@chakra-ui/react";

type NoVolunteerShiftsRowProps = {
  firstName: string;
  status: string;
};

const NoVolunteerShiftsRow: React.FC<NoVolunteerShiftsRowProps> = ({
  firstName,
  status,
}: NoVolunteerShiftsRowProps): React.ReactElement => {
  return (
    <Box
      w="full"
      pl="32px"
      pr="20px"
      pb="12px"
      pt="12px"
      bg="white"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <Text textStyle="body-regular" fontSize="14px">
        {firstName} has no {status} shifts right now.
      </Text>
    </Box>
  );
};

export default NoVolunteerShiftsRow;

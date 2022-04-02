import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";
import { VolunteerPages } from "../../../../constants/Volunteer";

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <Flex h="100vh" flexFlow="column">
      <VolunteerNavbar defaultIndex={VolunteerPages.VolunteerShiftsPage} />
      <Box bg="background.light">
        <Text textStyle="display-large">Volunteer Shifts</Text>
      </Box>
    </Flex>
  );
};

export default VolunteerShiftsPage;

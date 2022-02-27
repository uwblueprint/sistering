import React from "react";
import { Box, Text } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <div>
      <VolunteerNavbar defaultIndex={0} />
      <Box bg="background.light">
        <Text textStyle="display-large">Volunteer Shifts</Text>
      </Box>
    </div>
  );
};

export default VolunteerShiftsPage;

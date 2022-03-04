import React from "react";
import { Box, Text } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";
import { VolunteerPages } from "../../../../constants/Volunteer";

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <div>
      <VolunteerNavbar defaultIndex={VolunteerPages.VolunteerShiftsPage} />
      <Box bg="background.light">
        <Text textStyle="display-large">Volunteer Shifts</Text>
      </Box>
    </div>
  );
};

export default VolunteerShiftsPage;

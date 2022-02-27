import React from "react";
import { Box, Text } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";
<<<<<<< HEAD
import { VolunteerPages } from "../../../../constants/Volunteer";
=======
>>>>>>> Create VolunteerNavbar

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <div>
<<<<<<< HEAD
      <VolunteerNavbar defaultIndex={VolunteerPages.VolunteerShiftsPage} />
=======
      <VolunteerNavbar defaultIndex={0} />
>>>>>>> Create VolunteerNavbar
      <Box bg="background.light">
        <Text textStyle="display-large">Volunteer Shifts</Text>
      </Box>
    </div>
  );
};

export default VolunteerShiftsPage;

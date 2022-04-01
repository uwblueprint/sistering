import React from "react";
import { Box, Text } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";
import { VolunteerPages } from "../../../../constants/Volunteer";
import ShiftTimeHeader from "../../../admin/schedule/ShiftTimeHeader";

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <div>
      <VolunteerNavbar defaultIndex={VolunteerPages.VolunteerShiftsPage} />
      <Box bg="background.light">
        <Text textStyle="display-large">Volunteer Shifts</Text>
      </Box>
      <ShiftTimeHeader
        dateTimes={["5:00pm - 7:00pm", "7:00pm - 9:00pm", "9:00pm - 12:00am"]}
        onDateSelected={(date) => console.log(date)}
      />
    </div>
  );
};

export default VolunteerShiftsPage;

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
        shifts={[
          {
            shiftId: 1,
            shiftStartTime: new Date("2022-04-11T13:30"),
            shiftEndTime: new Date("2022-04-11T15:30"),
          },
          {
            shiftId: 2,
            shiftStartTime: new Date("2022-04-11T16:30"),
            shiftEndTime: new Date("2022-04-11T18:30"),
          },
        ]}
        onShiftSelected={(id: number) => console.log(id)}
      />
    </div>
  );
};

export default VolunteerShiftsPage;

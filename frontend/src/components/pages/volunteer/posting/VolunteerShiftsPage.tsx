import React from "react";
import { Container, Box } from "@chakra-ui/react";
import VolunteerShiftsTable from "../../../volunteer/shifts/VolunteerShiftsTable";

const upcomingShift = {
  name: "Posting Name",
  link: "URL",
  startTime: "2022-01-21T00:00:00+00:00",
  endTime: "2022-01-24T00:00:00+00:00",
};

const pendingShift = {
  name: "Posting Name",
  link: "URL",
  deadline: "Deadline: Friday, February 17",
};

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <Box bgColor="background.light" p={10}>
      <Container bgColor="background.white" maxW="container.xl">
        <VolunteerShiftsTable shifts={[]} />
      </Container>
    </Box>
  );
};

export default VolunteerShiftsPage;

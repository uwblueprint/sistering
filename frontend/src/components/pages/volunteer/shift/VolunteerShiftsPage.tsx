import React from "react";
import { Flex, Box, Container } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";
import { VolunteerPages } from "../../../../constants/Volunteer";
import VolunteerShiftsTable from "../../../volunteer/shifts/VolunteerShiftsTable";

const upcomingShift = {
  postingName: "Posting Name",
  postingLink: "URL",
  startTime: "2022-01-21T00:00:00+00:00",
  endTime: "2022-01-24T00:00:00+00:00",
  deadline: "",
};

const pendingShift = {
  postingName: "Posting Name",
  postingLink: "URL",
  deadline: "Deadline: Friday, February 17",
  startTime: "",
  endTime: "",
};

const mockData = [
  {
    date: new Date("2022-01-21T00:00:00+00:00"),
    shifts: [upcomingShift, pendingShift],
  },
  {
    date: new Date("2022-01-22T00:00:00+00:00"),
    shifts: [upcomingShift, pendingShift],
  },
  {
    date: new Date("2022-01-23T00:00:00+00:00"),
    shifts: [upcomingShift, pendingShift],
  },
];

const VolunteerShiftsPage = (): React.ReactElement => {
  return (
    <Flex h="100vh" flexFlow="column">
      <VolunteerNavbar defaultIndex={VolunteerPages.VolunteerShiftsPage} />
      <Box bg="background.light" p={10}>
        <Container
          maxW="container.xl"
          backgroundColor="background.white"
          px={0}
        >
          <VolunteerShiftsTable shifts={[]} />
        </Container>
      </Box>
    </Flex>
  );
};

export default VolunteerShiftsPage;

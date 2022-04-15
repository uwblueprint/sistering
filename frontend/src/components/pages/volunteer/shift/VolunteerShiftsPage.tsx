import React from "react";
import { Flex, Box, Container } from "@chakra-ui/react";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";
import { VolunteerPages } from "../../../../constants/Volunteer";
import VolunteerShiftsTable from "../../../volunteer/shifts/VolunteerShiftsTable";
import { ShiftSignupStatus } from "../../../../types/api/ShiftSignupTypes";

const upcomingShift = {
  postingName: "Posting Name",
  postingLink: "/volunteer/posting/1",
  startTime: "2022-01-21T11:00:00+00:00",
  endTime: "2022-01-21T12:00:00+00:00",
  deadline: "",
  status: "CONFIRMED" as ShiftSignupStatus,
};

const pendingShift = {
  postingName: "Posting Name",
  postingLink: "/volunteer/posting/2",
  deadline: "Deadline: Friday, February 17",
  startTime: "",
  endTime: "",
  status: "PUBLISHED" as ShiftSignupStatus,
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

import AdminScheduleVolunteerTable, {
  Signup,
} from "../../../admin/schedule/AdminScheduleVolunteerTable";

const VolunteerShiftsPage = (): React.ReactElement => {
  const [signups, setSignups] = useState<Signup[]>([
    {
      volunteerId: "1",
      volunteerName: "Brian Tu",
      note: "hire me",
      status: "PENDING",
    },
    {
      volunteerId: "2",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "3",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "4",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "5",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "6",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "7",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "8",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "9",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
    {
      volunteerId: "10",
      volunteerName: "Joseph Hu",
      note: "dont hire me",
      status: "PENDING",
    },
  ]);
  const selectAllSignups = () => {
    setSignups(
      signups.map((signup) => {
        return {
          ...signup,
          status: signup.status !== "PUBLISHED" ? "CONFIRMED" : "PUBLISHED",
        };
      }),
    );
  };
  const updateSignupStatus = (id: string, isChecked: boolean) => {
    let index;
    for (let i = 0; i < signups.length; i += 1) {
      let signup;
      if (signups[i].volunteerId === id) {
        index = i;
        signup = signups[i];
      }
    }
    if (index !== undefined) {
      const updatedSignups = [...signups];
      updatedSignups[index] = {
        ...signups[index],
        status: isChecked ? "CONFIRMED" : "PENDING",
      };
      setSignups(updatedSignups);
    }
  };
  return (
    <Flex h="100vh" flexFlow="column">
      <VolunteerNavbar defaultIndex={VolunteerPages.VolunteerShiftsPage} />
      <Box bg="background.light" p={10} h="100vp">
        <Container
          maxW="container.xl"
          backgroundColor="background.white"
          px={0}
        >
          <VolunteerShiftsTable shifts={mockData} />
        </Container>
      </Box>
      <Box w="400px" h="full" overflow="auto">
        <AdminScheduleVolunteerTable
          signups={signups}
          selectAll={selectAllSignups}
          updateSignupStatus={updateSignupStatus}
        />
      </Box>
    </Flex>
  );
};

export default VolunteerShiftsPage;

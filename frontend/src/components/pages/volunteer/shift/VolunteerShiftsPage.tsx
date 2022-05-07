import React, { useState, useLayoutEffect } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import VolunteerShiftsTable from "../../../volunteer/shifts/VolunteerShiftsTable";
import {
  ShiftSignupStatus,
  ShiftSignupPostingResponseDTO,
} from "../../../../types/api/ShiftSignupTypes";
import Navbar from "../../../common/Navbar";
import {
  VolunteerNavbarTabs,
  VolunteerPages,
} from "../../../../constants/Tabs";
import ErrorModal from "../../../common/ErrorModal";
import { FilterType } from "../../../../types/DateFilterTypes";
import { dateInRange } from "../../../../utils/DateTimeUtils";

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

const SHIFT_SIGNUPS = gql`
  query ShiftSignups($userId: ID!) {
    getShiftSignupsForUser(userId: $userId) {
      shiftId
      shiftStartTime
      shiftEndTime
      status
      postingId
      postingTitle
      autoClosingDate
    }
  }
`;

const VolunteerShiftsPage = (): React.ReactElement => {
  const error = false; // TODO: replace variable with error from GQL query or mutation

  const [shiftSignups, setShiftSignups] = useState<
    ShiftSignupPostingResponseDTO[]
  >([]);

  const [unfilteredShiftSignups, setUnfilteredShiftSignups] = useState<
    ShiftSignupPostingResponseDTO[]
  >([]);
  const [filter, setFilter] = useState<FilterType>("week");

  useQuery(SHIFT_SIGNUPS, {
    variables: { userId: 2 },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      console.log("data", data);
      setShiftSignups(data.getShiftSignupsForUser);
      setUnfilteredShiftSignups(data.getShiftSignupsForUser);
    },
  });
  return (
    <Flex h="100vh" flexFlow="column">
      {error && <ErrorModal />}
      <Navbar
        defaultIndex={VolunteerPages.VolunteerShifts}
        tabs={VolunteerNavbarTabs}
      />
      <Box bg="background.light" p={10} h="100vp">
        <Container
          maxW="container.xl"
          backgroundColor="background.white"
          px={0}
        >
          <VolunteerShiftsTable shifts={shiftSignups} />
        </Container>
      </Box>
    </Flex>
  );
};

export default VolunteerShiftsPage;

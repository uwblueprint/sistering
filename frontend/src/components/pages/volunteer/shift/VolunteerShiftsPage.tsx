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

  // useLayoutEffect(() => {
  //   let filteredShiftSignups;
  //   switch (filter) {
  //     case "month":
  //       filteredShiftSignups = unfilteredShiftSignups?.filter((shiftSignup) =>
  //         dateInRange(shiftSignup.shiftStartTime, "month"),
  //       );
  //       setShiftSignups(filteredShiftSignups ?? []);
  //       break;
  //     case "all":
  //       setShiftSignups(unfilteredShiftSignups);
  //       break;
  //     default:
  //       filteredShiftSignups = unfilteredShiftSignups?.filter((shiftSignup) =>
  //         dateInRange(shiftSignup.shiftStartTime, "week"),
  //       );
  //       setShiftSignups(filteredShiftSignups ?? []);
  //       break;
  //   }
  // }, [filter, unfilteredShiftSignups]);

  const changeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: FilterType = e.target.value as FilterType;
    setFilter(value);
  };

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

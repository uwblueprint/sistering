import React, { useState } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import VolunteerShiftsTable from "../../../volunteer/shifts/VolunteerShiftsTable";
import { ShiftSignupPostingResponseDTO } from "../../../../types/api/ShiftSignupTypes";
import Navbar from "../../../common/Navbar";
import {
  VolunteerNavbarTabs,
  VolunteerPages,
} from "../../../../constants/Tabs";
import ErrorModal from "../../../common/ErrorModal";
import {
  ShiftSignupsQueryInput,
  ShiftSignupsQueryResponse,
} from "../../../../types/api/ShiftTypes";
import AUTHENTICATED_USER_KEY from "../../../../constants/AuthConstants";
import { AuthenticatedUser } from "../../../../types/AuthTypes";
import { getLocalStorageObj } from "../../../../utils/LocalStorageUtils";

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
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );
  const error = false; // TODO: replace variable with error from GQL query or mutation

  const [shiftSignups, setShiftSignups] = useState<
    ShiftSignupPostingResponseDTO[]
  >([]);

  useQuery<ShiftSignupsQueryResponse, ShiftSignupsQueryInput>(SHIFT_SIGNUPS, {
    variables: { userId: currentUser?.id },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setShiftSignups(data.getShiftSignupsForUser);
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

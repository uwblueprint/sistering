import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Spacer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";
import { ShiftResponseDTO } from "../../../../types/api/ShiftTypes";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import { SignupRequestDTO } from "../../../../types/api/SignupTypes";

// TODO: A filter should be added to the backend, currently, no filter is supported
const SHIFTS_BY_POSTING = gql`
  query VolunteerPostingAvailabilities_ShiftsByPosting($postingId: ID!) {
    shiftsByPosting(postingId: $postingId) {
      id
      postingId
      startTime
      endTime
    }
  }
`;

// TODO: Remove redundancy from other pages
const POSTING = gql`
  query VolunteerPostingDetails_Posting($id: ID!) {
    posting(id: $id) {
      title
      description
      branch {
        name
      }
      startDate
      endDate
      numVolunteers
      skills {
        name
      }
      employees {
        id
      }
      autoClosingDate
    }
  }
`;

const VolunteerPostingAvailabilities = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { loading: isShiftsLoading, data: { shiftsByPosting } = {} } = useQuery(
    SHIFTS_BY_POSTING,
    {
      variables: { postingId: id },
      fetchPolicy: "cache-and-network",
    },
  );
  const {
    loading: isPostingLoading,
    data: { posting: postingDetails } = {},
  } = useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });
  const history = useHistory();
  const toast = useToast();
  // TODO: Use these state of selected shifts + notes for submission
  const [shiftSignups, setShiftSignups] = useState<ShiftResponseDTO[]>([]);
  const [signupNotes, setSignupNotes] = useState<SignupRequestDTO[]>([]);

  if (isPostingLoading || isShiftsLoading) {
    return <Spinner />;
  }

  return !(isShiftsLoading || isPostingLoading) && !shiftsByPosting ? (
    <Redirect to="/not-found" />
  ) : (
    <Box bg="background.light" pt={14} px={100} minH="100vh">
      <Button
        onClick={() => history.push(`/volunteer/posting/${id}`)}
        variant="link"
        mb={4}
        leftIcon={<ChevronLeftIcon />}
      >
        Back to posting details
      </Button>
      <Flex pb={7}>
        <Text textStyle="display-large">Select your Availability</Text>
        <Spacer />
        <Button
          onClick={() => {
            // Submit the selected shifts
            console.log(shiftSignups);
            console.log(signupNotes);

            toast({
              title: "Availability Submitted",
              description: "Your availability has been submitted for review.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            history.push(`/volunteer/posting/${id}`);
          }}
        >
          Submit
        </Button>
      </Flex>
      <VolunteerAvailabilityTable
        postingShifts={shiftsByPosting as ShiftResponseDTO[]}
        postingStartDate={
          new Date(Date.parse((postingDetails as PostingResponseDTO).startDate))
        }
        postingEndDate={
          new Date(Date.parse((postingDetails as PostingResponseDTO).endDate))
        }
        selectedShifts={shiftSignups}
        setSelectedShifts={setShiftSignups}
        signupNotes={signupNotes}
        setSignupNotes={setSignupNotes}
      />
    </Box>
  );
};

export default VolunteerPostingAvailabilities;

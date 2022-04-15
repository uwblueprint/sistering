import React, { useState } from "react";
import { Box, Button, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";

import { gql, useMutation, useQuery } from "@apollo/client";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";
import { ShiftResponseDTO } from "../../../../types/api/ShiftTypes";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import {
  SignupRequestDTO,
  SignupResponseDTO,
} from "../../../../types/api/SignupTypes";

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
  query VolunteerPostingAvailabilitiesDetails_Posting($id: ID!) {
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

// WE pass the user id from our current session token
// TODO: Make this pass in a array of DTO
const SUBMIT_SIGNUPS = gql`
  mutation VolunteerPostingAvailabilities_SubmitSignups(
    $upsertDeleteShifts: UpsertDeleteShiftSignupRequestDTO!
  ) {
    upsertDeleteShiftSignups(upsertDeleteShifts: $upsertDeleteShifts) {
      status
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

  const [submitSignups] = useMutation<{ submitSignups: SignupResponseDTO }>(
    SUBMIT_SIGNUPS,
  );

  const history = useHistory();
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
          onClick={async () => {
            // Submit the selected shifts
            console.log(shiftSignups);
            console.log(signupNotes);
            console.log(shiftsByPosting);

            // Assume Num volunteers would be one...
            // TODO: Merge data from shiftSignups and signupNotes together to pass into query
            const graphQLResult = await submitSignups({
              variables: {
                upsertDeleteShifts: {
                  upsertShiftSignups: shiftSignups.map((signup) => {
                    const { id: shiftId } = signup;
                    return {
                      shiftId,
                      userId: "1", // TODO: Replace with userID from me query or cookie
                      note: "",
                      numVolunteers: 0, // TODO: Replace with actual numVolunteer or make optional if allowed
                    } as SignupRequestDTO;
                  }),
                  deleteShiftSignups: [], // Here, we want a new init state for existing signups to get deleted shifts
                },
              },
            });

            // TODO: Do something after submission (move on to some page?)...
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

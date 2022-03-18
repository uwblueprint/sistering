import React, { useState } from "react";
import { Box, Button, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";
import { ShiftDTO, ShiftResponseDTO } from "../../../../types/api/ShiftTypes";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";

// TODO: A filter should be added to the backend, currently, no filter is supported
const SHIFTS = gql`
  query VolunteerPostingAvailabilities_Shifts {
    shifts {
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
  const { loading: isShiftsLoading, data: { shifts } = {} } = useQuery(SHIFTS, {
    fetchPolicy: "cache-and-network",
  });
  const {
    loading: isPostingLoading,
    data: { posting: postingDetails } = {},
  } = useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });
  const history = useHistory();
  // TODO: Use this state of selected shifts for submission
  const [selectedShifts, setSelectedShifts] = useState<ShiftDTO[]>([]);

  if (isPostingLoading || isShiftsLoading) {
    return <Spinner />;
  }

  return !(isShiftsLoading || isPostingLoading) && !shifts ? (
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
            console.log(selectedShifts);
          }}
        >
          Submit
        </Button>
      </Flex>
      <VolunteerAvailabilityTable
        postingShifts={(shifts as ShiftResponseDTO[]).filter(
          (shift) => shift.postingId === id,
        )}
        postingStartDate={
          new Date(Date.parse((postingDetails as PostingResponseDTO).startDate))
        }
        postingEndDate={
          new Date(Date.parse((postingDetails as PostingResponseDTO).endDate))
        }
        selectedShifts={selectedShifts}
        setSelectedShifts={setSelectedShifts}
      />
    </Box>
  );
};

export default VolunteerPostingAvailabilities;

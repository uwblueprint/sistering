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

import { gql, useMutation, useQuery } from "@apollo/client";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";
import { ShiftWithSignupAndVolunteerResponseDTO } from "../../../../types/api/ShiftTypes";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import {
  DeleteSignupRequestDTO,
  SignupRequestDTO,
  SignupResponseDTO,
} from "../../../../types/api/SignupTypes";
import AUTHENTICATED_USER_KEY from "../../../../constants/AuthConstants";
import { AuthenticatedUser } from "../../../../types/AuthTypes";
import { getLocalStorageObj } from "../../../../utils/LocalStorageUtils";

// TODO: A filter should be added to the backend, currently, no filter is supported
// TODO: Check we we need confirmed shift status
const SHIFTS_WITH_SIGNUPS_BY_POSTING = gql`
  query VolunteerPostingAvailabilities_ShiftsWithSignupsByPosting(
    $postingId: ID!
    $userId: ID!
  ) {
    shiftsWithSignupsAndVolunteersByPosting(
      postingId: $postingId
      userId: $userId
    ) {
      id
      postingId
      startTime
      endTime
      signups {
        shiftId
        shiftStartTime
        shiftEndTime
        note
      }
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
  // TODO: Get current user ID from cookie or me query
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const { id } = useParams<{ id: string }>();
  // TODO: Use query by user ids to get signed up shifts
  const {
    loading: isShiftsLoading,
    data: { shiftsWithSignupsAndVolunteersByPosting: shiftsByPosting } = {},
  } = useQuery(SHIFTS_WITH_SIGNUPS_BY_POSTING, {
    variables: { postingId: id, userId: currentUser?.id },
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
  const toast = useToast();
  const [submitSignups] = useMutation<{ submitSignups: SignupResponseDTO }>(
    SUBMIT_SIGNUPS,
  );
  // TODO: Use these state of selected shifts + notes for submission
  // init shiftSignups and notes from query, combine type into one
  const [shiftSignups, setShiftSignups] = useState<
    ShiftWithSignupAndVolunteerResponseDTO[]
  >([]);
  const [deleteSignups, setDeleteSignups] = useState<
    { shiftId: string; toDelete: boolean }[]
  >([]);

  if (isPostingLoading || isShiftsLoading) {
    return <Spinner />;
  }

  console.log(shiftSignups);
  console.log(deleteSignups);
  console.log(shiftsByPosting as ShiftWithSignupAndVolunteerResponseDTO[]);
  console.log(
    (
      (shiftsByPosting as ShiftWithSignupAndVolunteerResponseDTO[]) ?? []
    ).filter((shift) => shift.signups.length > 0),
  );

  // setShiftSignups(
  //   (
  //     (shiftsByPosting as ShiftWithSignupAndVolunteerResponseDTO[]) ?? []
  //   ).filter((shift) => shift.signups.length > 0),
  // );
  // setDeleteSignups(
  //   ((shiftsByPosting as ShiftWithSignupAndVolunteerResponseDTO[]) ?? [])
  //     .filter((shift) => shift.signups.length > 0)
  //     .map((shift) => {
  //       return {
  //         shiftId: shift.id,
  //         toDelete: false,
  //       };
  //     }),
  // );

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
            // console.log(shiftsByPosting);
            console.log("press");
            console.log(shiftSignups);

            toast({
              title: "Availability Submitted",
              description: "Your availability has been submitted for review.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });

            // Assume Num volunteers would be one...
            // TODO: Merge data from shiftSignups and signupNotes together to pass into query
            const graphQLResult = await submitSignups({
              variables: {
                upsertDeleteShifts: {
                  upsertShiftSignups: shiftSignups.map((signup) => {
                    const { id: shiftId } = signup;
                    return {
                      shiftId,
                      userId: currentUser?.id,
                      note: signup.signups[0].note,
                      numVolunteers: 0, // TODO: Confirm this is correct for init
                    } as SignupRequestDTO;
                  }),
                  deleteShiftSignups: deleteSignups
                    .filter((signup) => signup.toDelete)
                    .map((shift) => {
                      return {
                        shiftId: shift.shiftId,
                        userId: currentUser?.id,
                      } as DeleteSignupRequestDTO;
                    }),
                },
              },
            });
            history.push(`/volunteer/posting/${id}`);
          }}
        >
          Submit
        </Button>
      </Flex>
      <VolunteerAvailabilityTable
        postingShifts={
          shiftsByPosting as ShiftWithSignupAndVolunteerResponseDTO[]
        }
        postingStartDate={
          new Date(Date.parse((postingDetails as PostingResponseDTO).startDate))
        }
        postingEndDate={
          new Date(Date.parse((postingDetails as PostingResponseDTO).endDate))
        }
        selectedShifts={shiftSignups}
        setSelectedShifts={setShiftSignups}
      />
    </Box>
  );
};

export default VolunteerPostingAvailabilities;

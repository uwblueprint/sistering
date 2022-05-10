import { Flex, Box, Text, Button, Spacer } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import cloneDeep from "lodash.clonedeep";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../../types/api/ShiftTypes";
import {
  AdminSchedulingSignupsAndVolunteerResponseDTO,
  ShiftSignupStatus,
} from "../../../../types/api/SignupTypes";
import Navbar from "../../../common/Navbar";
import { AdminNavbarTabs, AdminPages } from "../../../../constants/Tabs";
import AdminSchedulePageHeader from "../../../admin/schedule/AdminSchedulePageHeader";
import AdminPostingScheduleHeader from "../../../admin/schedule/AdminPostingScheduleHeader";
import ErrorModal from "../../../common/ErrorModal";
import MonthViewShiftCalendar from "../../../admin/ShiftCalendar/MonthViewShiftCalendar";
import AdminScheduleTable from "../../../admin/schedule/AdminScheduleTable";
import ScheduleSidePanel from "../../../admin/schedule/ScheduleSidePanel";
import Loading from "../../../common/Loading";

type AdminScheduleTableDataQueryResponse = {
  shiftsWithSignupsAndVolunteersByPosting: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
};

type AdminScheduleTableDataQueryInput = {
  postingId: number;
  userId?: number;
  signupStatus?: ShiftSignupStatus;
};

enum AdminScheduleViews {
  CalendarView,
  ReviewView,
}

const ADMIN_SCHEDULE_TABLE_DATA_QUERY = gql`
  query AdminScheduleShiftsAndSignups(
    $postingId: ID!
    $userId: ID
    $signupStatus: SignupStatus
  ) {
    shiftsWithSignupsAndVolunteersByPosting(
      postingId: $postingId
      userId: $userId
      signupStatus: $signupStatus
    ) {
      id
      postingId
      startTime
      endTime
      signups {
        shiftStartTime
        shiftEndTime
        numVolunteers
        note
        status
        volunteer {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

const SUBMIT_SIGNUPS = gql`
  mutation VolunteerPostingAvailabilities_SubmitSignups(
    $upsertDeleteShifts: UpsertDeleteShiftSignupRequestDTO!
  ) {
    upsertDeleteShiftSignups(upsertDeleteShifts: $upsertDeleteShifts) {
      status
    }
  }
`;

const POSTING = gql`
  query AdminSchedule_Posting($id: ID!) {
    posting(id: $id) {
      title
      description
      branch {
        name
      }
      startDate
      endDate
    }
  }
`;

const ShiftScheduleCalendar = ({
  shifts,
}: {
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
}) =>
  shifts.length > 0 && (
    <MonthViewShiftCalendar
      events={shifts.map((shift) => {
        return {
          id: shift.id,
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          groupId: "", // TODO: Add groupId for saved/unsaved
        };
      })}
      shifts={shifts}
    />
  );

const AdminSchedulePostingPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [shifts, setShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [
    currentlyEditingShift,
    setcurrentlyEditingShift,
  ] = useState<AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO>();
  const [currentView, setCurrentView] = useState<AdminScheduleViews>(
    AdminScheduleViews.CalendarView,
  );
  const [
    submitSignups,
    { loading: submitSignupsLoading, error: submitSignupsError },
  ] = useMutation(SUBMIT_SIGNUPS);

  const { error: tableDataQueryError, loading: tableDataLoading } = useQuery<
    AdminScheduleTableDataQueryResponse,
    AdminScheduleTableDataQueryInput
  >(ADMIN_SCHEDULE_TABLE_DATA_QUERY, {
    variables: {
      postingId: Number(id),
    },
    onCompleted: (data) =>
      setShifts(data.shiftsWithSignupsAndVolunteersByPosting),
    fetchPolicy: "no-cache",
  });

  const {
    error: postingError,
    loading: postingLoading,
    data: { posting: postingDetails } = {},
  } = useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  // Change status of shift to PENDING
  const removeSignup = (shiftId: string, userId: string) => {
    const newShifts = cloneDeep(shifts);
    for (let i = 0; i < newShifts.length; i += 1) {
      if (newShifts[i].id === shiftId) {
        for (let j = 0; j < newShifts[i].signups.length; j += 1) {
          if (newShifts[i].signups[j].volunteer.id === userId) {
            newShifts[i].signups[j].status = "PENDING";
            break;
          }
        }
        break;
      }
    }
    setShifts(newShifts);
  };

  const handleSidePanelEditClick = (
    shift?: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => setcurrentlyEditingShift(shift);

  const handleSelectAllSignupsClick = () => {
    if (!currentlyEditingShift) return;
    const signupsCopy = [...currentlyEditingShift.signups];
    const updatedSignups: AdminSchedulingSignupsAndVolunteerResponseDTO[] = signupsCopy.map(
      (signup) => {
        return {
          ...signup,
          status: signup.status !== "PUBLISHED" ? "CONFIRMED" : "PUBLISHED",
        };
      },
    );
    setcurrentlyEditingShift({
      ...currentlyEditingShift,
      signups: updatedSignups,
    });
  };

  const handleSignupCheckboxClick = (
    volunteerId: string,
    isChecked: boolean,
  ) => {
    if (!currentlyEditingShift) return;

    const signupIndex = currentlyEditingShift.signups.findIndex(
      (signup) => signup.volunteer.id === volunteerId,
    );
    if (signupIndex >= 0) {
      const signupsCopy = [...currentlyEditingShift.signups];
      const signup = currentlyEditingShift.signups[signupIndex];
      signupsCopy[signupIndex] = {
        ...signup,
        status: isChecked ? "CONFIRMED" : "PENDING",
      };
      setcurrentlyEditingShift({
        ...currentlyEditingShift,
        signups: signupsCopy,
      });
    }
  };

  const handleSidePanelSaveClick = async () => {
    if (!currentlyEditingShift) return;
    await submitSignups({
      variables: {
        upsertDeleteShifts: {
          upsertShiftSignups: currentlyEditingShift.signups.map((signup) => ({
            shiftId: currentlyEditingShift.id,
            userId: signup.volunteer.id,
            note: signup.note,
            numVolunteers: signup.numVolunteers,
            status: signup.status,
          })),
          deleteShiftSignups: [],
        },
      },
    });

    const shiftsCopy = cloneDeep(shifts);
    const shiftIndex = shiftsCopy.findIndex(
      (shift) => shift.id === currentlyEditingShift.id,
    );
    shiftsCopy[shiftIndex].signups = [...currentlyEditingShift.signups];
    setShifts(shiftsCopy);

    setcurrentlyEditingShift(undefined);
  };

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      {(tableDataQueryError || submitSignupsError || postingError) && (
        <ErrorModal />
      )}
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={AdminNavbarTabs}
      />
      {currentView === AdminScheduleViews.CalendarView ? (
        <Flex>
          <Box flex={1}>
            <AdminSchedulePageHeader
              branchName={postingDetails?.branch?.name}
            />
            <AdminPostingScheduleHeader
              postingID={Number(id)}
              postingName={postingDetails?.title}
              onReviewClick={() =>
                setCurrentView(AdminScheduleViews.ReviewView)
              }
            />
            {tableDataLoading || postingLoading ? (
              <Loading />
            ) : (
              ShiftScheduleCalendar({ shifts })
            )}
          </Box>
          <Box w="400px" overflow="hidden">
            <ScheduleSidePanel
              shifts={shifts}
              currentlyEditingShift={currentlyEditingShift}
              onEditSignupsClick={handleSidePanelEditClick}
              onSelectAllSignupsClick={handleSelectAllSignupsClick}
              onSignupCheckboxClick={handleSignupCheckboxClick}
              onSaveSignupsClick={handleSidePanelSaveClick}
              submitSignupsLoading={submitSignupsLoading}
            />
          </Box>
        </Flex>
      ) : (
        <Box
          backgroundColor="background.light"
          width="100%"
          alignItems="center"
          px="100px"
          pt={14}
          minH="100vh"
        >
          <Button
            onClick={() => setCurrentView(AdminScheduleViews.CalendarView)}
            variant="link"
            mb={4}
            leftIcon={<ChevronLeftIcon />}
          >
            Back to editing
          </Button>
          <Flex pb={6}>
            <Text textStyle="display-medium">{postingDetails?.title}</Text>
            <Spacer />
            <Button
              onClick={() => {
                // Submit the selected shifts
                // eslint-disable-next-line no-console
                console.log("TODO: Publish");
              }}
            >
              Publish schedule
            </Button>
          </Flex>
          {shifts.length > 0 && (
            <AdminScheduleTable
              startDate={postingDetails?.startDate}
              endDate={postingDetails?.endDate}
              shifts={shifts.sort()}
              removeSignup={removeSignup}
            />
          )}
        </Box>
      )}
    </Flex>
  );
};

export default AdminSchedulePostingPage;

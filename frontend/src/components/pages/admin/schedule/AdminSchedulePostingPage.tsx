import { Flex, Box, Text, Button, Spacer } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import cloneDeep from "lodash.clonedeep";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import moment from "moment";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../../types/api/ShiftTypes";
import {
  AdminSchedulingSignupsAndVolunteerResponseDTO,
  ShiftSignupStatus,
  UpsertSignupDTO,
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
import { getUTCDateForDateTimeString } from "../../../../utils/DateTimeUtils";

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
  onDayClick,
  onShiftClick,
}: {
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  onDayClick: (calendarDay: Date) => void;
  onShiftClick: (
    shift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => void;
}) =>
  shifts.length > 0 && (
    <MonthViewShiftCalendar
      events={shifts.map((shift) => {
        return {
          id: shift.id,
          start: getUTCDateForDateTimeString(shift.startTime.toString()),
          end: getUTCDateForDateTimeString(shift.endTime.toString()),
          groupId: "", // TODO: Add groupId for saved/unsaved
        };
      })}
      shifts={shifts}
      onDayClick={onDayClick}
      onShiftClick={onShiftClick}
    />
  );

const AdminSchedulePostingPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [shifts, setShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [
    selectedShift,
    setSelectedShift,
  ] = useState<AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO>(
    shifts[0],
  );
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
  const [sidePanelShifts, setSidePanelShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<Date>();

  useEffect(() => {
    const shiftsOfDay = shifts.filter((shift) =>
      moment.utc(shift.startTime).isSame(moment.utc(selectedDay), "day"),
    );
    setSidePanelShifts(shiftsOfDay);
    // Set selected shift to first shift if current selected is not in same day
    if (
      selectedShift &&
      !moment
        .utc(selectedShift.startTime)
        .isSame(moment.utc(selectedDay), "day")
    ) {
      setSelectedShift(shiftsOfDay[0]);
    }
  }, [shifts, selectedDay, selectedShift]);

  const { error: tableDataQueryError, loading: tableDataLoading } = useQuery<
    AdminScheduleTableDataQueryResponse,
    AdminScheduleTableDataQueryInput
  >(ADMIN_SCHEDULE_TABLE_DATA_QUERY, {
    variables: {
      postingId: Number(id),
    },
    onCompleted: ({ shiftsWithSignupsAndVolunteersByPosting: shiftsData }) => {
      setShifts(shiftsData);

      if (shiftsData.length) {
        const firstDay = shiftsData[0]?.startTime;
        setSelectedDay(firstDay);
        setSidePanelShifts(
          shiftsData.filter((shift) =>
            moment(shift.startTime).isSame(moment(firstDay), "day"),
          ),
        );
      }
    },
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

  const handleDayClick = (calendarDate: Date) => setSelectedDay(calendarDate);

  const handleShiftClick = (
    shift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => setSelectedShift(shift);

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

  const handleOnPublishClick = async () => {
    const shiftsCopy = cloneDeep(shifts);
    const publishedSignups: UpsertSignupDTO[] = [];
    shiftsCopy.forEach((shift, shiftIndex) =>
      shift.signups.forEach((signup, signupIndex) => {
        if (signup.status === "CONFIRMED") {
          publishedSignups.push({
            shiftId: shift.id,
            userId: signup.volunteer.id,
            status: "PUBLISHED",
            numVolunteers: signup.numVolunteers,
            note: signup.note,
          });
          shiftsCopy[shiftIndex].signups[signupIndex].status = "PUBLISHED";
        }
      }),
    );

    if (publishedSignups.length) {
      await submitSignups({
        variables: {
          upsertDeleteShifts: {
            upsertShiftSignups: publishedSignups,
            deleteShiftSignups: [],
          },
        },
      });
    }

    setShifts(shiftsCopy);
    setCurrentView(AdminScheduleViews.CalendarView);
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
              ShiftScheduleCalendar({
                shifts,
                onDayClick: handleDayClick,
                onShiftClick: handleShiftClick,
              })
            )}
          </Box>
          <Box w="400px" overflow="hidden">
            <ScheduleSidePanel
              shifts={sidePanelShifts}
              currentlyEditingShift={currentlyEditingShift}
              onEditSignupsClick={handleSidePanelEditClick}
              onSelectAllSignupsClick={handleSelectAllSignupsClick}
              onSignupCheckboxClick={handleSignupCheckboxClick}
              onSaveSignupsClick={handleSidePanelSaveClick}
              submitSignupsLoading={submitSignupsLoading}
              selectedShift={selectedShift}
              setSelectedShift={setSelectedShift}
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
            <Button onClick={handleOnPublishClick}>Publish schedule</Button>
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

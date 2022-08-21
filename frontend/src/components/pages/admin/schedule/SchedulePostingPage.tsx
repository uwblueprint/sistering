import {
  Flex,
  Box,
  Text,
  Button,
  Spacer,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import {
  AdminNavbarTabs,
  AdminPages,
  EmployeeNavbarTabs,
} from "../../../../constants/Tabs";
import AdminSchedulePageHeader from "../../../admin/schedule/AdminSchedulePageHeader";
import AdminPostingScheduleHeader from "../../../admin/schedule/AdminPostingScheduleHeader";
import ErrorModal from "../../../common/ErrorModal";
import MonthViewShiftCalendar from "../../../admin/ShiftCalendar/MonthViewShiftCalendar";
import AdminScheduleTable from "../../../admin/schedule/AdminScheduleTable";
import ScheduleSidePanel from "../../../admin/schedule/ScheduleSidePanel";
import VolunteerSidePanel from "../../../admin/schedule/volunteersidepanel/VolunteerSidePanel";
import Loading from "../../../common/Loading";
import {
  getUTCDateForDateTimeString,
  isPast,
} from "../../../../utils/DateTimeUtils";
import AuthContext from "../../../../contexts/AuthContext";
import { Role } from "../../../../types/AuthTypes";
import { getPostingFilterStatusBySignupStatuses } from "../../../../utils/TypeUtils";
import { PostingFilterStatus } from "../../../../types/PostingTypes";
import { ADMIN_HOMEPAGE } from "../../../../constants/Routes";
import { PostingDataQueryResponse } from "../../../../types/api/PostingTypes";

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
      status
      autoClosingDate
    }
  }
`;

const CLOSING_DATE_NOT_PASSED_TOAST_ID = "closing-date-not-passed";

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

const checkHasConfirmedSignup = (
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[],
): boolean => {
  for (let i = 0; i < shifts.length; i += 1) {
    for (let j = 0; j < shifts[i].signups.length; j += 1) {
      if (shifts[i].signups[j].status in ["CONFIRMED", "PUBLISHED"]) {
        return true;
      }
    }
  }
  return false;
};

const SchedulePostingPage = (): React.ReactElement => {
  const toast = useToast();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useContext(AuthContext);
  const [isSuperAdmin] = useState(authenticatedUser?.role === Role.Admin);

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
  const [submitSignups, { loading: submitSignupsLoading }] = useMutation(
    SUBMIT_SIGNUPS,
  );
  const [sidePanelShifts, setSidePanelShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [hasConfirmedSignup, setHasConfirmedSignup] = useState<boolean>(false);

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
  } = useQuery<PostingDataQueryResponse>(POSTING, {
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

  const [volunteerId, setVolunteerId] = useState("");
  const [displayVolunteerSidePanel, setDisplayVolunteerSidePanel] = useState(
    false,
  );

  const handleVolunteerProfileClick = (
    isDisplayingVolunteer: boolean,
    userId: string,
  ) => {
    setDisplayVolunteerSidePanel(isDisplayingVolunteer);
    setVolunteerId(userId);
  };

  const handleDayClick = (calendarDate: Date) => {
    setSelectedDay(calendarDate);
    handleVolunteerProfileClick(false, "");
  };

  const handleShiftClick = (
    shift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => {
    setSelectedShift(shift);
    handleVolunteerProfileClick(false, "");
  };

  const handleSidePanelSaveClick = async () => {
    if (!currentlyEditingShift) return;
    try {
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
    } catch (error: unknown) {
      toast({
        title: "Cannot submit signups",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    const shiftsCopy = cloneDeep(shifts);
    const shiftIndex = shiftsCopy.findIndex(
      (shift) => shift.id === currentlyEditingShift.id,
    );
    shiftsCopy[shiftIndex].signups = [...currentlyEditingShift.signups];
    setShifts(shiftsCopy);

    setSelectedShift(currentlyEditingShift);
    setcurrentlyEditingShift(undefined);
  };

  const handleOnPublishClick = async () => {
    const shiftsCopy = cloneDeep(shifts);
    const upsertSignups: UpsertSignupDTO[] = [];
    shiftsCopy.forEach((shift, shiftIndex) =>
      shift.signups.forEach((signup, signupIndex) => {
        if (signup.status === "CONFIRMED") {
          upsertSignups.push({
            shiftId: shift.id,
            userId: signup.volunteer.id,
            status: "PUBLISHED",
            numVolunteers: signup.numVolunteers,
            note: signup.note,
          });
          shiftsCopy[shiftIndex].signups[signupIndex].status = "PUBLISHED";
        } else if (signup.status === "PENDING") {
          upsertSignups.push({
            shiftId: shift.id,
            userId: signup.volunteer.id,
            status: "CANCELED",
            numVolunteers: signup.numVolunteers,
            note: signup.note,
          });
          shiftsCopy[shiftIndex].signups[signupIndex].status = "CANCELED";
        }
      }),
    );

    if (upsertSignups.length) {
      const response = await submitSignups({
        variables: {
          upsertDeleteShifts: {
            upsertShiftSignups: upsertSignups,
            deleteShiftSignups: [],
          },
        },
      });

      if (response.errors == null) {
        toast({
          title: "Schedule Published",
          description: "Schedule has been published to volunteers.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        history.push(ADMIN_HOMEPAGE);
      }
    }

    setShifts(shiftsCopy);
    setCurrentView(AdminScheduleViews.CalendarView);
  };

  const isReadOnly =
    postingDetails === undefined ||
    (authenticatedUser && !isSuperAdmin) ||
    getPostingFilterStatusBySignupStatuses(
      postingDetails?.status,
      new Date(postingDetails?.endDate),
      shifts.flatMap((shift) =>
        shift.signups.flatMap((signup) => signup.status),
      ),
    ) === PostingFilterStatus.PAST;

  const isPostingClosed =
    postingDetails === undefined ||
    isPast(new Date(postingDetails.autoClosingDate));

  useEffect(() => {
    return () => {
      setVolunteerId("");
      setDisplayVolunteerSidePanel(false);
    };
  }, []);

  useEffect(() => {
    if (
      !isPostingClosed &&
      postingDetails !== undefined &&
      !toast.isActive(CLOSING_DATE_NOT_PASSED_TOAST_ID)
    ) {
      toast({
        id: CLOSING_DATE_NOT_PASSED_TOAST_ID,
        title:
          "Changes to this page cannot be made until posting closing date has passed",
        status: "error",
        position: "bottom-left",
        duration: 10000,
        isClosable: true,
        variant: "subtle",
        containerStyle: {
          minWidth: "72vw",
        },
      });
    }
  }, [isPostingClosed, postingDetails, toast]);

  useEffect(() => {
    setHasConfirmedSignup(checkHasConfirmedSignup(shifts));
  }, [shifts]);

  if (postingLoading || postingDetails === undefined) {
    return <Loading />;
  }

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      {(tableDataQueryError || postingError) && <ErrorModal />}
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={isSuperAdmin ? AdminNavbarTabs : EmployeeNavbarTabs}
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
              isReadOnly={isReadOnly}
              isNotOpenForReview={!isPostingClosed}
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
          <Box width="25vw" overflow="hidden">
            {displayVolunteerSidePanel ? (
              <VolunteerSidePanel
                onVolunteerProfileClick={handleVolunteerProfileClick}
                volunteerId={volunteerId}
              />
            ) : (
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
                isReadOnly={isReadOnly}
                isNotOpenForReview={!isPostingClosed}
                onVolunteerProfileClick={handleVolunteerProfileClick}
              />
            )}
          </Box>
        </Flex>
      ) : (
        <Box
          backgroundColor="background.light"
          width="100%"
          alignItems="center"
          px="100px"
          pt={14}
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
            <Tooltip
              hasArrow
              label="Must have at least one signup"
              shouldWrapChildren
              isDisabled={hasConfirmedSignup}
            >
              <Button
                onClick={handleOnPublishClick}
                disabled={!hasConfirmedSignup}
              >
                Publish schedule
              </Button>
            </Tooltip>
          </Flex>
          {shifts.length > 0 && (
            <AdminScheduleTable
              startDate={new Date(postingDetails.startDate)}
              endDate={new Date(postingDetails.endDate)}
              shifts={shifts.sort()}
              removeSignup={removeSignup}
            />
          )}
        </Box>
      )}
    </Flex>
  );
};

export default SchedulePostingPage;

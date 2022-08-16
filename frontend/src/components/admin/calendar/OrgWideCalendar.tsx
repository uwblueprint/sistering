import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Box, Flex } from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import {
  AdminNavbarTabs,
  AdminPages,
  EmployeeNavbarTabs,
} from "../../../constants/Tabs";
import AuthContext from "../../../contexts/AuthContext";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";
import { Role } from "../../../types/AuthTypes";
import { getUTCDateForDateTimeString } from "../../../utils/DateTimeUtils";
import ErrorModal from "../../common/ErrorModal";
import Loading from "../../common/Loading";
import Navbar from "../../common/Navbar";
import AdminPostingScheduleHeader from "../schedule/AdminPostingScheduleHeader";
import AdminSchedulePageHeader from "../schedule/AdminSchedulePageHeader";
import ScheduleSidePanel from "../schedule/ScheduleSidePanel";
import VolunteerSidePanel from "../schedule/volunteersidepanel/VolunteerSidePanel";
import MonthViewShiftCalendar from "../ShiftCalendar/MonthViewShiftCalendar";

type AdminOrgCalendarShiftsAndSignupsResponse = {
  shiftsWithSignupsAndVolunteers: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
};

type AdminOrgCalendarPosting = {
  id: string;
  title: string;
  branch: {
    id: string;
    name: string;
  };
};

type AdminOrgCalendarPostings = {
  postings: AdminOrgCalendarPosting[];
};

const ADMIN_ORG_CALENDAR_TABLE_DATA_QUERY = gql`
  query AdminOrgCalendarShiftsAndSignups {
    shiftsWithSignupsAndVolunteers {
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

const ADMIN_ORG_CALENDAR_POSTINGS = gql`
  query AdminOrgCalendarPostings($id: ID!) {
    postings(userId: $id) {
      id
      title
      branch {
        id
        name
      }
    }
  }
`;

const ReadOnlyScheduleSidePanel = ({
  shifts,
  selectedShift,
  setSelectedShift,
  handleVolunteerProfileClick,
}: {
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  selectedShift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO;
  setSelectedShift: React.Dispatch<
    React.SetStateAction<AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO>
  >;
  handleVolunteerProfileClick: (
    isDisplayingVolunteer: boolean,
    userId: string,
  ) => void;
}) => {
  return (
    <ScheduleSidePanel
      shifts={shifts}
      onEditSignupsClick={() => {}}
      onSelectAllSignupsClick={() => {}}
      onSignupCheckboxClick={() => {}}
      onSaveSignupsClick={async () => {}}
      submitSignupsLoading={false}
      selectedShift={selectedShift}
      setSelectedShift={setSelectedShift}
      isReadOnly
      isNotOpenForReview
      onVolunteerProfileClick={handleVolunteerProfileClick}
    />
  );
};

const ReadOnlyAdminPostingScheduleHeader = ({
  selectedShift,
  userPostings,
}: {
  selectedShift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO;
  userPostings: AdminOrgCalendarPosting[];
}): React.ReactElement => {
  return selectedShift ? (
    <AdminPostingScheduleHeader
      postingID={Number(selectedShift.postingId)}
      postingName={
        userPostings.find(
          (userPosting) => userPosting.id === selectedShift.postingId,
        )?.title || ""
      }
      onReviewClick={() => {}}
      isNotOpenForReview
      isReadOnly
    />
  ) : (
    <Box
      height="77px"
      borderBottomWidth="2px"
      borderBottomColor="background.dark"
    />
  );
};

const OrgWideCalendar = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const [isSuperAdmin] = useState(authenticatedUser?.role === Role.Admin);
  const [userPostings, setUserPostings] = useState<AdminOrgCalendarPosting[]>(
    [],
  );
  const [shifts, setShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [
    selectedShift,
    setSelectedShift,
  ] = useState<AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO>(
    shifts[0],
  );
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [sidePanelShifts, setSidePanelShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [volunteerId, setVolunteerId] = useState("");
  const [displayVolunteerSidePanel, setDisplayVolunteerSidePanel] = useState(
    false,
  );

  const [
    getShiftsAndSignups,
    { error: tableDataQueryError, loading: tableDataLoading },
  ] = useLazyQuery<AdminOrgCalendarShiftsAndSignupsResponse>(
    ADMIN_ORG_CALENDAR_TABLE_DATA_QUERY,
    {
      onCompleted: ({ shiftsWithSignupsAndVolunteers: shiftsData }) => {
        let scheduledShifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[] = [];
        scheduledShifts = shiftsData.filter(
          (shift) =>
            userPostings
              .map((posting) => posting.id)
              .includes(shift.postingId) &&
            shift.signups.length > 0 &&
            shift.signups.some((signup) => signup.status === "PUBLISHED"),
        );
        setShifts(scheduledShifts);
        if (shiftsData.length) {
          const firstDay = scheduledShifts[0]?.startTime;
          setSelectedDay(firstDay);
          setSidePanelShifts(
            shiftsData.filter((shift) =>
              moment(shift.startTime).isSame(moment(firstDay), "day"),
            ),
          );
        }
      },
      fetchPolicy: "no-cache",
    },
  );

  const {
    error: postingsQueryError,
    loading: postingsLoading,
  } = useQuery<AdminOrgCalendarPostings>(ADMIN_ORG_CALENDAR_POSTINGS, {
    variables: { id: authenticatedUser?.id },
    onCompleted: ({ postings }) => {
      setUserPostings(postings);
      getShiftsAndSignups();
    },
    fetchPolicy: "no-cache",
  });

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

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      {(tableDataQueryError || postingsQueryError) && <ErrorModal />}
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={isSuperAdmin ? AdminNavbarTabs : EmployeeNavbarTabs}
      />

      <Flex>
        <Box flex={1}>
          <AdminSchedulePageHeader
            branchName={
              userPostings.find(
                (userPosting) => userPosting.id === selectedShift?.postingId,
              )?.branch.name || "Organization-Wide"
            }
          />
          {ReadOnlyAdminPostingScheduleHeader({
            selectedShift,
            userPostings,
          })}
          {tableDataLoading || postingsLoading ? (
            <Loading />
          ) : (
            <MonthViewShiftCalendar
              events={shifts.map((shift) => {
                return {
                  id: shift.id,
                  start: getUTCDateForDateTimeString(
                    shift.startTime.toString(),
                  ),
                  end: getUTCDateForDateTimeString(shift.endTime.toString()),
                  groupId: "",
                };
              })}
              shifts={shifts}
              onDayClick={handleDayClick}
              onShiftClick={handleShiftClick}
            />
          )}
        </Box>
        <Box w="400px" overflow="hidden">
          {displayVolunteerSidePanel ? (
            <VolunteerSidePanel
              onVolunteerProfileClick={handleVolunteerProfileClick}
              volunteerId={volunteerId}
            />
          ) : (
            ReadOnlyScheduleSidePanel({
              shifts: sidePanelShifts,
              selectedShift,
              setSelectedShift,
              handleVolunteerProfileClick,
            })
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default OrgWideCalendar;

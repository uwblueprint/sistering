import { gql, useQuery } from "@apollo/client";
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
import ScheduleSidePanel from "../schedule/ScheduleSidePanel";
import VolunteerSidePanel from "../schedule/volunteersidepanel/VolunteerSidePanel";
import MonthViewShiftCalendar from "../ShiftCalendar/MonthViewShiftCalendar";

type AdminOrgCalendarShiftsAndSignupsResponse = {
  shiftsWithSignupsAndVolunteers: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
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

const OrgWideCalendar = (): React.ReactElement => {
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
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [sidePanelShifts, setSidePanelShifts] = useState<
    AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [volunteerId, setVolunteerId] = useState("");
  const [displayVolunteerSidePanel, setDisplayVolunteerSidePanel] = useState(
    false,
  );

  const {
    error: tableDataQueryError,
    loading: tableDataLoading,
  } = useQuery<AdminOrgCalendarShiftsAndSignupsResponse>(
    ADMIN_ORG_CALENDAR_TABLE_DATA_QUERY,
    {
      onCompleted: ({ shiftsWithSignupsAndVolunteers: shiftsData }) => {
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
    },
  );

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
      {tableDataQueryError && <ErrorModal /> /* TODO: error */}
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={isSuperAdmin ? AdminNavbarTabs : EmployeeNavbarTabs}
      />

      <Flex>
        <Box flex={1}>
          {tableDataLoading ? ( // TODO: loading
            <Loading />
          ) : (
            shifts.length > 0 && (
              <MonthViewShiftCalendar
                events={shifts.map((shift) => {
                  return {
                    id: shift.id,
                    start: getUTCDateForDateTimeString(
                      shift.startTime.toString(),
                    ),
                    end: getUTCDateForDateTimeString(shift.endTime.toString()),
                    groupId: "", // TODO: Add groupId for saved/unsaved
                  };
                })}
                shifts={shifts}
                onDayClick={handleDayClick}
                onShiftClick={handleShiftClick}
              />
            )
          )}
        </Box>
        <Box w="400px" overflow="hidden">
          {displayVolunteerSidePanel ? (
            <VolunteerSidePanel
              onVolunteerProfileClick={handleVolunteerProfileClick}
              volunteerId={volunteerId}
            />
          ) : (
            <ScheduleSidePanel
              shifts={sidePanelShifts}
              currentlyEditingShift={selectedShift}
              onEditSignupsClick={() => {}}
              onSelectAllSignupsClick={() => {}}
              onSignupCheckboxClick={() => {}}
              onSaveSignupsClick={async () => {}}
              submitSignupsLoading={false}
              selectedShift={selectedShift}
              setSelectedShift={setSelectedShift}
              isReadOnly
              onVolunteerProfileClick={handleVolunteerProfileClick}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default OrgWideCalendar;

import { Flex, Box, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import cloneDeep from "lodash.clonedeep";

import { ShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../../types/api/ShiftTypes";
import {
  ShiftSignupStatus,
  SignupsAndVolunteerGraphQLResponseDTO,
} from "../../../../types/api/SignupTypes";
import Navbar from "../../../common/Navbar";
import { AdminNavbarTabs, AdminPages } from "../../../../constants/Tabs";
import AdminSchedulePageHeader from "../../../admin/schedule/AdminSchedulePageHeader";
import AdminPostingScheduleHeader from "../../../admin/schedule/AdminPostingScheduleHeader";
import ErrorModal from "../../../common/ErrorModal";
import MonthlyViewShiftCalendar, {
  ADMIN_SHIFT_CALENDAR_TEST_EVENTS,
} from "../../../admin/ShiftCalendar/MonthlyViewReadOnlyShiftCalendar";
import AdminScheduleTable, {
  TableTestData,
} from "../../../admin/schedule/AdminScheduleTable";
import ScheduleSidePanel from "../../../admin/schedule/ScheduleSidePanel";

type AdminScheduleTableDataQueryResponse = {
  shiftsWithSignupsAndVolunteersByPosting: ShiftWithSignupAndVolunteerGraphQLResponseDTO[];
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
      startTime
      endTime
      signups {
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

const AdminSchedulePostingPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [shifts, setShifts] = useState<
    ShiftWithSignupAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [currentlyEditingSignups, setCurrentlyEditingSignups] = useState<
    SignupsAndVolunteerGraphQLResponseDTO[]
  >([]);
  const [currentView, setCurrentView] = useState<AdminScheduleViews>(
    AdminScheduleViews.CalendarView,
  );

  const { error } = useQuery<
    AdminScheduleTableDataQueryResponse,
    AdminScheduleTableDataQueryInput
  >(ADMIN_SCHEDULE_TABLE_DATA_QUERY, {
    variables: { postingId: Number(id) },
    onCompleted: (data) =>
      setShifts(data.shiftsWithSignupsAndVolunteersByPosting),
    fetchPolicy: "no-cache",
  });

  const handleSidePanelEditClick = (
    signups: SignupsAndVolunteerGraphQLResponseDTO[],
  ) => setCurrentlyEditingSignups(signups);

  const handleSelectAllSignupsClick = () => {
    const updatedSignups: SignupsAndVolunteerGraphQLResponseDTO[] = currentlyEditingSignups.map(
      (signup) => {
        return {
          ...signup,
          status: signup.status !== "PUBLISHED" ? "CONFIRMED" : "PUBLISHED",
        };
      },
    );
    setCurrentlyEditingSignups(updatedSignups);
  };

  const handleSignupCheckboxClick = (
    volunteerId: string,
    isChecked: boolean,
  ) => {
    const signupIndex = currentlyEditingSignups.findIndex(
      (signup) => signup.volunteer.id === volunteerId,
    );
    if (signupIndex >= 0) {
      const signupsCopy = cloneDeep(currentlyEditingSignups);
      signupsCopy[signupIndex].status = isChecked ? "CONFIRMED" : "PENDING";
      setCurrentlyEditingSignups(signupsCopy);
    }
  };

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      {error && <ErrorModal />}
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={AdminNavbarTabs}
      />
      {currentView === AdminScheduleViews.CalendarView ? (
        <Flex>
          <Box flex={1}>
            <AdminSchedulePageHeader branchName="Kitchen" />
            <AdminPostingScheduleHeader
              postingID={Number(id)}
              postingName="Posting Name"
              onReviewClick={() =>
                setCurrentView(AdminScheduleViews.ReviewView)
              }
            />
            <MonthlyViewShiftCalendar
              events={ADMIN_SHIFT_CALENDAR_TEST_EVENTS}
            />
          </Box>
          <Box w="400px" overflow="hidden">
            <ScheduleSidePanel
              shifts={shifts}
              currentlyEditingSignups={currentlyEditingSignups}
              onEditSignupsClick={handleSidePanelEditClick}
              onSelectAllSignupsClick={handleSelectAllSignupsClick}
              onSignupCheckboxClick={handleSignupCheckboxClick}
            />
          </Box>
        </Flex>
      ) : (
        <VStack
          backgroundColor="background.light"
          width="100%"
          alignItems="center"
          px="100px"
        >
          <AdminScheduleTable schedule={TableTestData} />
        </VStack>
      )}
    </Flex>
  );
};

export default AdminSchedulePostingPage;

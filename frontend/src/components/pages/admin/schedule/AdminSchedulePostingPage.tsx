import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Flex, Box, HStack, Text, VStack } from "@chakra-ui/react";

import { ShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../../types/api/ShiftTypes";
import {
  ShiftSignupStatus,
  SignupsAndVolunteerGraphQLResponseDTO,
} from "../../../../types/api/SignupTypes";

import AdminScheduleVolunteerTable, {
  Signup,
} from "../../../admin/schedule/AdminScheduleVolunteerTable";
import Navbar from "../../../common/Navbar";
import { AdminNavbarTabs, AdminPages } from "../../../../constants/Tabs";
import AdminSchedulePageHeader from "../../../admin/schedule/AdminSchedulePageHeader";
import AdminPostingScheduleHeader from "../../../admin/schedule/AdminPostingScheduleHeader";
import ShiftTimeHeader from "../../../admin/schedule/ShiftTimeHeader";
import MonthlyViewShiftCalendar, {
  ADMIN_SHIFT_CALENDAR_TEST_EVENTS,
} from "../../../admin/ShiftCalendar/MonthlyViewReadOnlyShiftCalendar";
import { formatDateStringYear } from "../../../../utils/DateTimeUtils";
import AdminScheduleTable, {
  TableTestData,
} from "../../../admin/schedule/AdminScheduleTable";

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
      signups {
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

const adminScheduleTableDataQueryToSignup = (
  data: AdminScheduleTableDataQueryResponse,
): Signup[] =>
  data.shiftsWithSignupsAndVolunteersByPosting
    .map((shift: ShiftWithSignupAndVolunteerGraphQLResponseDTO) =>
      shift.signups.map(
        (signup: SignupsAndVolunteerGraphQLResponseDTO): Signup => ({
          note: signup.note,
          status: signup.status,
          volunteerName: `${signup.volunteer.firstName} ${signup.volunteer.lastName}`,
          volunteerId: signup.volunteer.id,
        }),
      ),
    )
    .flat();

const AdminSchedulePostingPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [currentView, setCurrentView] = useState<AdminScheduleViews>(
    AdminScheduleViews.CalendarView,
  );

  useQuery<
    AdminScheduleTableDataQueryResponse,
    AdminScheduleTableDataQueryInput
  >(ADMIN_SCHEDULE_TABLE_DATA_QUERY, {
    variables: { postingId: Number(id) },
    onCompleted: (data) =>
      setSignups(adminScheduleTableDataQueryToSignup(data)),
    fetchPolicy: "no-cache",
  });

  const selectAllSignups = () => {
    setSignups(
      signups.map((signup) => {
        return {
          ...signup,
          status: signup.status !== "PUBLISHED" ? "CONFIRMED" : "PUBLISHED",
        };
      }),
    );
  };
  const updateSignupStatus = (volunteerId: string, isChecked: boolean) => {
    const index = signups.findIndex(
      (signup) => signup.volunteerId === volunteerId,
    );
    if (index > 0) {
      const updatedSignups = [...signups];
      updatedSignups[index].status = isChecked ? "CONFIRMED" : "PENDING";
      setSignups(updatedSignups);
    }
  };

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={AdminNavbarTabs}
      />
      {currentView === AdminScheduleViews.CalendarView ? (
        <HStack alignItems="start" spacing={0}>
          <Box width="full">
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
          <Box
            w="400px"
            overflow="hidden"
            borderLeftWidth="2px"
            borderLeftColor="background.dark"
            h="full"
          >
            <Box
              w="full"
              px="32px"
              py="17px"
              borderLeft="2px"
              borderBottom="2px"
              borderColor="background.dark"
            >
              <Text textStyle="heading">
                {formatDateStringYear(new Date().toString())}
              </Text>
            </Box>
            <ShiftTimeHeader
              shifts={[]}
              // eslint-disable-next-line no-console
              onShiftSelected={(shiftId: number) => console.log(shiftId)}
            />
            <AdminScheduleVolunteerTable
              signups={signups}
              numVolunteers={4}
              selectAll={selectAllSignups}
              updateSignupStatus={updateSignupStatus}
            />
          </Box>
        </HStack>
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

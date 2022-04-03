import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Spinner,
  TableContainer,
  VStack,
} from "@chakra-ui/react";

import { ShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../../types/api/ShiftTypes";
import {
  ShiftSignupStatus,
  SignupsAndVolunteerGraphQLResponseDTO,
} from "../../../../types/api/SignupTypes";
import AdminScheduleTable, {
  AdminScheduleDay,
  AdminScheduleSignup,
} from "../../../admin/schedule/AdminScheduleTable";

type AdminScheduleTableDataQueryResponse = {
  shiftsWithSignupsAndVolunteersByPosting: ShiftWithSignupAndVolunteerGraphQLResponseDTO[];
};

type AdminScheduleTableDataQueryInput = {
  postingId: number;
  userId?: number;
  signupStatus?: ShiftSignupStatus;
};

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
        volunteer {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

const adminScheduleTableDataQueryToAdminScheduleDay = (
  data: AdminScheduleTableDataQueryResponse,
): AdminScheduleDay[] =>
  data.shiftsWithSignupsAndVolunteersByPosting.map(
    (shift: ShiftWithSignupAndVolunteerGraphQLResponseDTO) => ({
      date: new Date(shift.startTime),
      signups: shift.signups.map(
        (
          signup: SignupsAndVolunteerGraphQLResponseDTO,
        ): AdminScheduleSignup => ({
          startTime: new Date(shift.startTime),
          endTime: new Date(shift.endTime),
          volunteer: {
            name: `${signup.volunteer.firstName} ${signup.volunteer.lastName}`,
            userId: signup.userId,
          },
        }),
      ),
    }),
  );

const isShiftSignupStatus = (value: string): value is ShiftSignupStatus => {
  return ["PENDING", "CONFIRMED", "CANCELED", "PUBLISHED"].includes(value);
};

const AdminScheduleTableDemo = (): React.ReactElement => {
  const [postingIdInput, setPostingIdInput] = useState<string>("1");
  const [userIdInput, setUserIdInput] = useState<string>("1");
  const [signupStateInput, setSignupStateInput] = useState<string>("");

  const { loading, data: adminScheduleTableData, refetch } = useQuery<
    AdminScheduleTableDataQueryResponse,
    AdminScheduleTableDataQueryInput
  >(ADMIN_SCHEDULE_TABLE_DATA_QUERY, {
    variables: { postingId: 1, userId: 1 },
    fetchPolicy: "no-cache",
  });

  const updateTable = () => {
    if (Number.isNaN(parseInt(postingIdInput, 10))) return;
    const res: AdminScheduleTableDataQueryInput = {
      postingId: parseInt(postingIdInput, 10),
    };
    if (userIdInput !== "" && !Number.isNaN(parseInt(userIdInput, 10)))
      res.userId = parseInt(userIdInput, 10);
    if (isShiftSignupStatus(signupStateInput))
      res.signupStatus = signupStateInput;
    refetch(res);
  };

  return (
    <Flex width="100%" justifyContent="center">
      <VStack width="70%">
        <FormControl>
          <HStack>
            <FormLabel>Posting ID</FormLabel>
            <Input
              value={postingIdInput}
              onChange={(e) => setPostingIdInput(e.target.value)}
            />
            <FormLabel>User ID</FormLabel>
            <Input
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
            />
            <FormLabel>Signup state</FormLabel>
            <Select onChange={(e) => setSignupStateInput(e.target.value)}>
              <option value=""> </option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELED">CANCELED</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </Select>
          </HStack>
        </FormControl>
        <Button onClick={updateTable}>Update Table</Button>
        {!loading && adminScheduleTableData ? (
          <TableContainer maxW="container.xl" width="100%">
            <AdminScheduleTable
              schedule={adminScheduleTableDataQueryToAdminScheduleDay(
                adminScheduleTableData,
              )}
            />
          </TableContainer>
        ) : (
          <Spinner />
        )}
      </VStack>
    </Flex>
  );
};

export default AdminScheduleTableDemo;

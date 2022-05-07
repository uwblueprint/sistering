import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Text,
  VStack,
  Button,
  Tabs,
  TabList,
  Tab,
  Box,
  Select,
  HStack,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import VolunteerShiftsTableRow from "./VolunteerShiftsTableRow";
import VolunteerShiftsTableDate from "./VolunteerShiftsTableDate";
import {
  ShiftSignupStatus,
  ShiftSignupPostingResponseDTO,
} from "../../../types/api/ShiftSignupTypes";

type Shift = {
  startTime: string;
  endTime: string;
  postingName: string;
  postingLink: string;
  deadline: string;
  status: ShiftSignupStatus;
};

type VolunteerDateShifts = {
  date: Date;
  shifts: Shift[];
};

type VolunteerShiftsTableProps = {
  // The schedule prop should be sorted by date in ascending order.
  shifts: ShiftSignupPostingResponseDTO[];
  // shifts: VolunteerDateShifts[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  const upcomingShifts = shifts.filter((shift) => shift.status === "PUBLISHED");
  const pendingShifts = shifts.filter(
    (shift) => shift.status === "PENDING" || shift.status === "CONFIRMED",
  );

  const [tabIndex, setTabIndex] = useState(0);
  const [displayShifts, setDisplayShifts] = useState(upcomingShifts);

  useEffect(() => {
    setDisplayShifts(tabIndex === 0 ? upcomingShifts : pendingShifts);
  }, [tabIndex, shifts]);

  return (
    <Box
      bgColor="background.white"
      borderRadius="12px"
      border="2px"
      borderColor="background.dark"
    >
      <HStack justifyContent="space-between" px={12}>
        <Tabs pt={8} onChange={(index) => setTabIndex(index)}>
          <TabList borderBottom="none">
            <Tab>Upcoming Shifts</Tab>
            <Tab>Requests Pending Confirmation</Tab>
          </TabList>
        </Tabs>
        <HStack>
          <Text>Showing: </Text>
          <Select width="194px" _hover={{ bgColor: "gray.100" }}>
            <option>This week</option>
            <option>This month</option>
            <option>All shifts</option>
          </Select>
        </HStack>
      </HStack>

      <Table variant="brand">
        <Tbody>
          {displayShifts.length > 0 ? (
            displayShifts.map((shift, idx) => (
              <VolunteerShiftsTableRow
                key={idx}
                postingName={shift.postingTitle}
                postingLink={shift.postingId}
                startTime={shift.shiftStartTime}
                endTime={shift.shiftEndTime}
                deadline={shift.autoClosingDate}
                status={shift.status}
              />
            ))
          ) : (
            // empty state
            <Tr>
              <Td>
                <Container maxW="container.xl" minH="90vh">
                  <VStack pt="25%">
                    <Text color="text.gray">No shifts to show</Text>
                    <Button variant="outline">Browse volunteer postings</Button>
                  </VStack>
                </Container>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default VolunteerShiftsTable;

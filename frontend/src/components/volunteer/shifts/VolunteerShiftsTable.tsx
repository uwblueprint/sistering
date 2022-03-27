import React, { Fragment } from "react";
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
} from "@chakra-ui/react";
import VolunteerShiftsTableRow from "./VolunteerShiftsTableRow";
import VolunteerShiftsTableDate from "./VolunteerShiftsTableDate";
import { ShiftSignupStatus } from "../../../types/api/ShiftSignupTypes";

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
  shifts: VolunteerDateShifts[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  if (!shifts.length) {
    return (
      <Container maxW="container.xl" minH="90vh">
        <VStack pt="25%">
          <Text color="text.gray">No shifts to show</Text>
          <Button variant="outline">Browse volunteer postings</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box
      bgColor="background.white"
      borderRadius="12px"
      border="2px"
      borderColor="background.dark"
    >
      <HStack justifyContent="space-between" px={12}>
        <Tabs pt={8}>
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
        {shifts.map((day) => (
          <Fragment key={day.date.toDateString()}>
            <VolunteerShiftsTableDate date={day.date} />{" "}
            {day.shifts.map((shift: Shift, idx) => (
              <VolunteerShiftsTableRow
                key={idx}
                postingName={shift.postingName}
                postingLink={shift.postingLink}
                startTime={shift.startTime}
                endTime={shift.endTime}
                deadline={shift.deadline}
                status={shift.status}
              />
            ))}
          </Fragment>
        ))}
      </Table>
    </Box>
  );
};

export default VolunteerShiftsTable;

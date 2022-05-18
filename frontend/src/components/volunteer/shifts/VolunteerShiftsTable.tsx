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
import moment from "moment";
import { useHistory } from "react-router-dom";
import VolunteerShiftsTableRow from "./VolunteerShiftsTableRow";
import { ShiftSignupPostingResponseDTO } from "../../../types/api/ShiftSignupTypes";
import { FilterType } from "../../../types/DateFilterTypes";
import { VOLUNTEER_POSTINGS_PAGE } from "../../../constants/Routes";

type VolunteerShiftsTableProps = {
  // The schedule prop should be sorted by date in ascending order.
  shifts: ShiftSignupPostingResponseDTO[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  const history = useHistory();
  const [filter, setFilter] = useState<FilterType>("week");
  const [tabIndex, setTabIndex] = useState(0);

  const upcomingShifts = shifts
    .filter((shift) => shift.status === "PUBLISHED")
    .filter((shift) => {
      if (filter === "all") {
        return true;
      }
      return moment().isSame(moment(shift.shiftStartTime), filter);
    });
  const pendingShifts = shifts
    .filter(
      (shift) => shift.status === "PENDING" || shift.status === "CONFIRMED",
    )
    .filter((shift) => {
      if (filter === "all") {
        return true;
      }
      return moment().isSame(moment(shift.autoClosingDate), filter);
    });

  const [displayShifts, setDisplayShifts] = useState(upcomingShifts);

  useEffect(() => {
    setDisplayShifts(tabIndex === 0 ? upcomingShifts : pendingShifts);
  }, [tabIndex, pendingShifts, upcomingShifts]);

  const changeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: FilterType = e.target.value as FilterType;
    setFilter(value);
  };

  return (
    <Box
      bgColor="background.white"
      borderRadius="12px"
      border="2px"
      borderColor="background.dark"
      h="784px"
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
          <Select
            width="194px"
            _hover={{ bgColor: "gray.100" }}
            onChange={changeFilter}
          >
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="all">All shifts</option>
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
                postingId={shift.postingId}
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
                    <Button
                      variant="outline"
                      onClick={() => history.push(VOLUNTEER_POSTINGS_PAGE)}
                    >
                      Browse volunteer postings
                    </Button>
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

import React, { useState } from "react";
import {
  Table,
  Text,
  Tabs,
  TabList,
  Tab,
  Box,
  Select,
  HStack,
  Tbody,
} from "@chakra-ui/react";
import moment from "moment";
import { ShiftSignupPostingResponseDTO } from "../../../types/api/ShiftSignupTypes";
import { FilterType } from "../../../types/DateFilterTypes";
import VolunteerUpcomingShiftsTable from "./VolunteerUpcomingShiftsTable";
import VolunteerPendingShiftsTableRow from "./VolunteerPendingShiftsTableRow";
import VolunteerShiftsTableEmptyState from "./VolunteerShiftsTableEmptyState";

type VolunteerShiftsTableProps = {
  // The schedule prop should be sorted by date in ascending order.
  shifts: ShiftSignupPostingResponseDTO[];
};

const UPCOMING_SHIFTS = 0;
const PENDING_SHIFTS = 1;
const FILLED_SHIFTS = 2;

const VolunteerShiftsTableContent = ({
  upcomingShifts,
  pendingShifts,
  filledShifts,
  tabIndex,
}: {
  upcomingShifts: ShiftSignupPostingResponseDTO[];
  pendingShifts: ShiftSignupPostingResponseDTO[];
  filledShifts: ShiftSignupPostingResponseDTO[];
  tabIndex: number;
}): React.ReactElement => {
  if (tabIndex === UPCOMING_SHIFTS && upcomingShifts.length > 0) {
    return <VolunteerUpcomingShiftsTable shifts={upcomingShifts} />;
  }
  if (tabIndex === PENDING_SHIFTS && pendingShifts.length > 0) {
    const uniquePostingIds = new Set();

    const uniquePostings = pendingShifts.filter((shift) => {
      if (uniquePostingIds.has(shift.postingId)) {
        return false;
      }
      uniquePostingIds.add(shift.postingId);
      return true;
    });

    return (
      <Table variant="brand">
        <Tbody>
          {uniquePostings.map((shift, idx) => (
            <VolunteerPendingShiftsTableRow
              key={idx}
              postingName={shift.postingTitle}
              postingId={shift.postingId}
              deadline={shift.autoClosingDate}
            />
          ))}
        </Tbody>
      </Table>
    );
  }
  if (tabIndex === FILLED_SHIFTS && filledShifts.length > 0) {
    return <VolunteerUpcomingShiftsTable shifts={filledShifts} />;
  }
  return <VolunteerShiftsTableEmptyState />;
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  const [filter, setFilter] = useState<FilterType>("week");
  const [tabIndex, setTabIndex] = useState(UPCOMING_SHIFTS);

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

  const filledShifts = shifts
    .filter((shift) => shift.status === "CANCELED")
    .filter((shift) => {
      if (filter === "all") {
        return true;
      }
      return moment().isSame(moment(shift.autoClosingDate), filter);
    });

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
      minH="784px"
    >
      <HStack
        justifyContent="space-between"
        px={12}
        borderBottom="2px"
        borderColor="background.dark"
      >
        <Tabs pt={8} onChange={(index) => setTabIndex(index)}>
          <TabList borderBottom="none">
            <Tab>Upcoming Shifts</Tab>
            <Tab>Pending Shifts</Tab>
            <Tab>Filled Shifts</Tab>
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
      <VolunteerShiftsTableContent
        upcomingShifts={upcomingShifts}
        pendingShifts={pendingShifts}
        filledShifts={filledShifts}
        tabIndex={tabIndex}
      />
    </Box>
  );
};

export default VolunteerShiftsTable;

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
import { useHistory } from "react-router-dom";
import { ShiftSignupPostingResponseDTO } from "../../../types/api/ShiftSignupTypes";
import { FilterType } from "../../../types/DateFilterTypes";
import VolunteerUpcomingShiftsTable from "./VolunteerUpcomingShiftsTable";
import VolunteerPendingShiftsTableRow from "./VolunteerPendingShiftsTableRow";
import VolunteerShiftsTableEmptyState from "./VolunteerShiftsTableEmptyState";

type VolunteerShiftsTableProps = {
  // The schedule prop should be sorted by date in ascending order.
  shifts: ShiftSignupPostingResponseDTO[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  const history = useHistory();
  const [filter, setFilter] = useState<FilterType>("week");
  const [isShowUpcomingShifts, setIsShowUpcomingShifts] = useState(true);

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
        <Tabs pt={8} onChange={(index) => setIsShowUpcomingShifts(index === 0)}>
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
      {/* eslint-disable-next-line no-nested-ternary */}
      {isShowUpcomingShifts && upcomingShifts.length > 0 ? (
        <VolunteerUpcomingShiftsTable shifts={upcomingShifts} />
      ) : !isShowUpcomingShifts && pendingShifts.length > 0 ? (
        <Table variant="brand">
          <Tbody>
            {pendingShifts.map((shift, idx) => (
              <VolunteerPendingShiftsTableRow
                key={idx}
                postingName={shift.postingTitle}
                postingId={shift.postingId}
                deadline={shift.autoClosingDate}
              />
            ))}
          </Tbody>
        </Table>
      ) : (
        <VolunteerShiftsTableEmptyState />
      )}
    </Box>
  );
};

export default VolunteerShiftsTable;

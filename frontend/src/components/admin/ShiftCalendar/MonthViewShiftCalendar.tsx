import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, Select, Spacer } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect } from "react";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";
import { MonthEvent } from "../../../types/CalendarTypes";
import {
  getFirstDayOfMonth,
  getMonthDiff,
  getMonthsInRange,
} from "../../../utils/DateTimeUtils";
import MonthlyViewShiftCalendar from "./MonthlyViewReadOnlyShiftCalendar";

type MonthViewShiftCalendarProps = {
  events: MonthEvent[];
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  onDayClick: (calendarDay: Date) => void;
  onShiftClick: (
    shift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => void;
};

const MonthViewShiftCalendar = ({
  events,
  shifts,
  onDayClick,
  onShiftClick,
}: MonthViewShiftCalendarProps): React.ReactElement => {
  const sortEvents = (unsortedEvents: MonthEvent[]): MonthEvent[] => {
    return unsortedEvents.sort((a, b) => {
      return moment(a.start).diff(moment(b.start));
    });
  };

  // Current month to display, indicated by the first day of the month.
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date(0));
  const [sortedEvents, setSortedEvents] = React.useState<MonthEvent[]>([]);

  useEffect(() => {
    const sortedEventsList = sortEvents(events);
    setSortedEvents(sortedEventsList);
    if (
      moment(selectedMonth).diff(moment(new Date(0)), "days") === 0 &&
      sortedEventsList.length > 0
    ) {
      setSelectedMonth(getFirstDayOfMonth(sortedEventsList[0].start));
    }
  }, [events, selectedMonth]);

  const getEventsInMonth = (): MonthEvent[] => {
    const selectedMonthString = moment(selectedMonth).format("YYYY-MM");
    const selectedMonthEvents = sortedEvents.filter((event) => {
      return moment(event.start).format("YYYY-MM") === selectedMonthString;
    });
    return selectedMonthEvents;
  };

  return sortedEvents && sortedEvents.length > 0 ? (
    <Box>
      <Flex alignContent="center" px={25} py={25}>
        <Button
          variant="link"
          leftIcon={<ChevronLeftIcon />}
          disabled={
            moment(selectedMonth).format("YYYY-MM") ===
            moment(sortedEvents[0].start).format("YYYY-MM")
          }
          onClick={() => {
            setSelectedMonth(
              moment(selectedMonth).subtract(1, "month").toDate(),
            );
          }}
        >
          Previous month
        </Button>
        <Spacer />
        <Select
          width="33%"
          _hover={{ bgColor: "gray.100" }}
          value={getMonthDiff(sortedEvents[0].start, selectedMonth)}
          onChange={(e) => {
            setSelectedMonth(
              moment(sortedEvents[0].start)
                .add(e.target.value, "month")
                .toDate(),
            );
          }}
        >
          {getMonthsInRange(
            getFirstDayOfMonth(sortedEvents[0].start),
            getFirstDayOfMonth(sortedEvents[sortedEvents.length - 1].start), // latest event
          ).map((month) => {
            return (
              <option
                key={month.toString()}
                value={getMonthDiff(sortedEvents[0].start, month)}
                color="gray.100"
              >
                {month.toLocaleString("default", { month: "long" })}{" "}
                {month.getFullYear()}
              </option>
            );
          })}
        </Select>
        <Spacer />
        <Button
          variant="link"
          rightIcon={<ChevronRightIcon />}
          disabled={
            moment(selectedMonth).format("YYYY-MM") ===
            moment(sortedEvents[sortedEvents.length - 1].start).format(
              "YYYY-MM",
            )
          }
          onClick={() => {
            setSelectedMonth(moment(selectedMonth).add(1, "month").toDate());
          }}
        >
          Next month
        </Button>
      </Flex>
      <MonthlyViewShiftCalendar
        events={getEventsInMonth()}
        shifts={shifts}
        initialDate={selectedMonth}
        onDayClick={onDayClick}
        onShiftClick={onShiftClick}
      />
    </Box>
  ) : (
    <Center mt={8}>No events to display</Center>
  );
};

export default MonthViewShiftCalendar;

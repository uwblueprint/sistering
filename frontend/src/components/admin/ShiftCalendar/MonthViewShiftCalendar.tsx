import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Select, Spacer } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect } from "react";
import { MonthEvent } from "../../../types/CalendarTypes";
import {
  getFirstDayOfMonth,
  getMonthDiff,
  getMonthsInRange,
} from "../../../utils/DateTimeUtils";
import MonthlyViewShiftCalendar from "./MonthlyViewReadOnlyShiftCalendar";

export const ADMIN_SHIFT_CALENDAR_TEST_EVENTS: MonthEvent[] = [
  {
    id: "1",
    groupId: "unsaved",
    start: new Date("2022-03-01 09:00:00 UTC"),
    end: new Date("2022-03-01 10:00:00 UTC"),
  },
  {
    id: "2",
    groupId: "unsaved",
    start: new Date("2022-07-01 10:00:00 UTC"),
    end: new Date("2022-07-01 11:30:00 UTC"),
  },
  {
    id: "3",
    groupId: "saved",
    start: new Date("2022-03-01 15:00:00 UTC"),
    end: new Date("2022-03-01 17:00:00 UTC"),
  },
  {
    id: "4",
    groupId: "unsaved",
    start: new Date("2022-06-02 17:15:00 UTC"),
    end: new Date("2022-06-02 19:00:00 UTC"),
  },
  {
    id: "5",
    groupId: "saved",
    start: new Date("2022-03-02 05:00:00 UTC"),
    end: new Date("2022-03-02 13:00:00 UTC"),
  },
  {
    id: "6",
    groupId: "saved",
    start: new Date("2022-03-14 14:00:00 UTC"),
    end: new Date("2022-03-14 15:00:00 UTC"),
  },
  {
    id: "7",
    groupId: "unsaved",
    start: new Date("2022-04-17 11:00:00 UTC"),
    end: new Date("2022-04-17 13:00:00 UTC"),
  },
  {
    id: "8",
    groupId: "saved",
    start: new Date("2022-07-12 11:00:00 UTC"),
    end: new Date("2022-07-12 13:00:00 UTC"),
  },
  {
    id: "9",
    groupId: "saved",
    start: new Date("2022-04-19 09:00:00 UTC"),
    end: new Date("2022-04-19 11:00:00 UTC"),
  },
  {
    id: "10",
    groupId: "saved",
    start: new Date("2022-06-05 13:00:00 UTC"),
    end: new Date("2022-06-05 15:00:00 UTC"),
  },
];

type MonthViewShiftCalendarProps = {
  events: MonthEvent[];
};

const MonthViewShiftCalendar = ({
  events,
}: MonthViewShiftCalendarProps): React.ReactElement => {
  const sortEvents = (unsortedEvents: MonthEvent[]): MonthEvent[] => {
    return unsortedEvents.sort((a, b) => {
      return moment(a.start).diff(moment(b.start));
    });
  };

  // Current month to display, indicated by the first day of the month.
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date());
  const [sortedEvents, setSortedEvents] = React.useState<MonthEvent[]>([]);

  useEffect(() => {
    const sortedEventsList = sortEvents(events);
    setSortedEvents(sortedEventsList);
    setSelectedMonth(getFirstDayOfMonth(sortedEventsList[0].start));
  }, [events]);

  const getEventsInMonth = (): MonthEvent[] => {
    const selectedMonthString = moment(selectedMonth).format("YYYY-MM");
    return sortedEvents.filter((event) => {
      return moment(event.start).format("YYYY-MM") === selectedMonthString;
    });
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
      <MonthlyViewShiftCalendar events={getEventsInMonth()} />
    </Box>
  ) : (
    <Box>No events to display</Box>
  );
};

export default MonthViewShiftCalendar;

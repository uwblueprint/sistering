import { DateSelectArg } from "@fullcalendar/react";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import FormHeader from "../../common/FormHeader";
import {
  ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS,
  ADMIN_POSTING_CREATE_SHIFTS_TIME,
} from "../../../constants/Copy";
import PostingContext from "../../../contexts/admin/PostingContext";
import PostingContextDispatcherContext from "../../../contexts/admin/PostingContextDispatcherContext";
import WeekViewShiftCalendar from "../ShiftCalendar/WeekViewShiftCalendar";
import { Event } from "../../../types/CalendarTypes";
import { Shift } from "../../../types/PostingContextTypes";
import { RecurrenceInterval } from "../../../types/PostingTypes";
import {
  getISOStringDateTime,
  getNextSunday,
  getPreviousSunday,
  getUTCDateForDateTimeString,
} from "../../../utils/DateTimeUtils";
import StickyBackNext from "../../common/StickyBackNext";

type PostingFormShiftsProps = {
  navigateBack: () => void;
  navigateToNext: () => void;
};

const PostingFormShifts: React.FC<PostingFormShiftsProps> = ({
  navigateBack,
  navigateToNext,
}: PostingFormShiftsProps): React.ReactElement => {
  const {
    startDate: startDateFromCtx,
    endDate: endDateFromCtx,
    times: timesFromCtx,
    recurrenceInterval: recurrenceIntervalFromCtx,
    autoClosingDate: autoClosingDateFromCtx,
  } = useContext(PostingContext);
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  const [startDate, setStartDate] = useState<string>(startDateFromCtx);
  const [endDate, setEndDate] = useState<string>(endDateFromCtx);
  const [autoClosingDate] = useState<string>(autoClosingDateFromCtx);
  const [recurrenceInterval, setRecurrenceInterval] = useState<
    RecurrenceInterval | ""
  >(recurrenceIntervalFromCtx);
  const [events, setEvents] = useState<Event[]>(
    timesFromCtx.map((time, index) => ({
      id: String(index),
      start: getUTCDateForDateTimeString(time.startTime),
      end: getUTCDateForDateTimeString(time.endTime),
    })),
  );
  const [eventCount, setEventCount] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [startDateErrorMessage, setStartDateErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [endDateErrorMessage, setEndDateErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [
    recurrenceIntervalErrorMessage,
    setRecurrenceIntervalErrorMessage,
  ] = useState<string | undefined>(undefined);
  const [eventsErrorMessage, setEventsErrorMessage] = useState<
    string | undefined
  >(undefined);

  const initialDateProps = startDate
    ? { initialDate: getPreviousSunday(startDate) }
    : {};

  useEffect(() => {
    if (startDate) {
      const previousSundayStr = getPreviousSunday(startDate);
      const nextSundayStr = getNextSunday(startDate);
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) =>
            event.start >= new Date(previousSundayStr) &&
            event.start < new Date(nextSundayStr),
        ),
      );
    }
  }, [startDate, setEvents]);

  const addEvent = (newEvent: DateSelectArg) => {
    setEvents([
      ...events,
      {
        start: newEvent.start,
        end: newEvent.end,
        id: `event-${eventCount}`,
      },
    ]);
    setEventCount(eventCount + 1);
  };

  const changeEvent = (event: Event, oldEvent: Event, currEvents: Event[]) => {
    const newEvent = currEvents.find(
      (currEvent) => currEvent.id === oldEvent.id,
    );
    if (newEvent) {
      newEvent.start = event.start;
      newEvent.end = event.end;
      setEvents([...currEvents]);
    }
  };

  const deleteEvent = (currEvents: Event[]) => {
    if (selectedEvent) {
      for (let i = 0; i < currEvents.length; i += 1) {
        if (currEvents[i].id === selectedEvent.id) {
          currEvents.splice(i, 1);
          break;
        }
      }
      setEvents(currEvents);
    }
  };

  const addStartDate = (date: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_START_DATE",
      value: date,
    });
  };

  const addEndDate = (date: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_END_DATE",
      value: date,
    });
  };

  const addRecurrenceInterval = (interval: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_RECURRENCE_INTERVAL",
      value: interval as RecurrenceInterval,
    });
  };

  const addTimes = (times: Shift[]) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_TIMES",
      value: times,
    });
  };

  const handleNext = () => {
    // field validations
    setStartDateErrorMessage(
      !startDate ? "Please enter a valid date." : undefined,
    );
    setEndDateErrorMessage(!endDate ? "Please enter a valid date." : undefined);
    setRecurrenceIntervalErrorMessage(
      !recurrenceInterval ? "Please select a frequency." : undefined,
    );
    setEventsErrorMessage(
      events.length < 1 ? "Please select at least one shift time." : undefined,
    );

    if (startDate > endDate) {
      setStartDateErrorMessage(
        "Please ensure that start date is before end date.",
      );
      setEndDateErrorMessage(
        "Please ensure that end date is after start date.",
      );
    }
    if (autoClosingDate >= startDate) {
      setStartDateErrorMessage(
        "Please select a start date after the sign up period.",
      );
    }

    const now = new Date();
    let currentMonth = `${now.getMonth() + 1}`;
    if (currentMonth.length < 2) {
      currentMonth = `0${currentMonth}`;
    }
    let currentDay = `${now.getDate()}`;
    if (currentDay.length < 2) {
      currentDay = `0${currentDay}`;
    }
    const currentDateISOString = `${now.getFullYear()}-${currentMonth}-${currentDay}`;
    if (startDate < currentDateISOString) {
      setStartDateErrorMessage(
        "Please select a start date that is not in the past.",
      );
    }
    if (endDate < currentDateISOString) {
      setEndDateErrorMessage(
        "Please select an end date that is not in the past.",
      );
    }

    const validated =
      startDate &&
      endDate &&
      recurrenceInterval &&
      events.length >= 1 &&
      startDate <= endDate &&
      startDate >= currentDateISOString &&
      endDate >= currentDateISOString;

    if (validated) {
      addStartDate(startDate);
      addEndDate(endDate);
      addRecurrenceInterval(recurrenceInterval);
      addTimes(
        events.map((event) => ({
          startTime: getISOStringDateTime(event.start),
          endTime: getISOStringDateTime(event.end),
        })),
      );
      navigateToNext();
    }
  };

  const recurrenceOptions = [
    { label: "None", value: "NONE" },
    { label: "Weekly", value: "WEEKLY" },
    { label: "Bi-weekly", value: "BIWEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
  ];

  return (
    <Box px={12}>
      <VStack w="full" spacing={5} alignItems="flex-start" px={3} py={12}>
        <FormHeader symbol="2" title="Scheduling Time Slots" />
        <VStack spacing={30} alignItems="flex-start" px={2}>
          <Text textStyle="caption">
            {ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS}
          </Text>
          <FormControl
            isRequired
            isInvalid={recurrenceIntervalErrorMessage !== undefined}
          >
            <FormLabel textStyle="body-regular">Recurrence Frequency</FormLabel>
            <Flex alignItems="flex-start">
              <VStack spacing={2} alignItems="flex-end">
                <Select
                  placeholder="How often will this occur?"
                  size="sm"
                  width="425px"
                  value={recurrenceInterval}
                  onChange={(e) =>
                    setRecurrenceInterval(e.target.value as RecurrenceInterval)
                  }
                >
                  {recurrenceOptions.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {recurrenceIntervalErrorMessage}
                </FormErrorMessage>
              </VStack>
            </Flex>
          </FormControl>
          <VStack spacing={2} alignItems="flex-start">
            <Text textStyle="body-regular" fontWeight="medium">
              Select Start and End Dates
            </Text>
            <HStack spacing={5} alignItems="flex-start">
              <FormControl
                isRequired
                isInvalid={startDateErrorMessage !== undefined}
              >
                <Flex>
                  <FormLabel textStyle="caption">From</FormLabel>
                  <VStack spacing={2} alignItems="flex-end">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      size="sm"
                      style={{
                        maxWidth: "278px",
                      }}
                    />
                    <FormErrorMessage>{startDateErrorMessage}</FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={endDateErrorMessage !== undefined}
              >
                <Flex>
                  <FormLabel textStyle="caption">To</FormLabel>
                  <VStack spacing={2} alignItems="flex-end">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      size="sm"
                      style={{
                        maxWidth: "278px",
                      }}
                    />
                    <FormErrorMessage>{endDateErrorMessage}</FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
            </HStack>
          </VStack>
          <VStack spacing={2}>
            <FormControl
              isRequired
              isInvalid={eventsErrorMessage !== undefined}
            >
              <FormLabel textStyle="body-regular">Select Shift Times</FormLabel>
              <Text textStyle="caption">
                {ADMIN_POSTING_CREATE_SHIFTS_TIME}
              </Text>
              <FormErrorMessage>{eventsErrorMessage}</FormErrorMessage>
            </FormControl>
          </VStack>
        </VStack>
      </VStack>
      {/* Temp hacky fix to get the calendar to re-render when startDate changes
       * TODO: implement better solution described here
       * https://github.com/fullcalendar/fullcalendar/issues/4684#issuecomment-620787260
       */}
      <Box key={startDate} pb="20">
        <WeekViewShiftCalendar
          events={events}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          addEvent={addEvent}
          changeEvent={changeEvent}
          deleteEvent={deleteEvent}
          startDate={startDate}
          endDate={endDate}
          isRecurringEvents={recurrenceInterval !== "NONE"}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...initialDateProps}
        />
      </Box>
      <StickyBackNext onBack={navigateBack} onNext={handleNext} />
    </Box>
  );
};

export default PostingFormShifts;

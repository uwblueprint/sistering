import { DateSelectArg } from "@fullcalendar/react";
import React, { useContext, useState } from "react";
import {
  Container,
  Divider,
  Flex,
  HStack,
  VStack,
  Text,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";

import FormHeader from "../../common/FormHeader";
import {
  ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS,
  ADMIN_POSTING_CREATE_SHIFTS_TIME,
} from "../../../constants/Copy";
import PostingContextDispatcherContext from "../../../contexts/admin/PostingContextDispatcherContext";
import ShiftCalendar, { Event } from "../ShiftCalendar/ShiftCalendar";
import { Shift } from "../../../types/PostingContextTypes";
import { RecurrenceInterval } from "../../../types/PostingTypes";
import { getISOStringDateTime } from "../../../utils/DateTimeUtils";

const CreatePostingShifts = (): React.ReactElement => {
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [
    recurrenceInterval,
    setRecurrenceInterval,
  ] = useState<RecurrenceInterval>("" as RecurrenceInterval);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventCount, setEventCount] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [recurrenceIntervalError, setRecurrenceIntervalError] = useState(false);
  const [eventsError, setEventsError] = useState(false);

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
    setStartDateError(!startDate);
    setEndDateError(!endDate);
    setRecurrenceIntervalError(!recurrenceInterval);
    setEventsError(events.length < 1);

    if (startDate > endDate) {
      setStartDateError(true);
      setEndDateError(true);
    }

    if (startDate && endDate && recurrenceInterval && events.length >= 1) {
      addStartDate(startDate);
      addEndDate(endDate);
      addRecurrenceInterval(recurrenceInterval);
      addTimes(
        events.map((event) => ({
          startTime: getISOStringDateTime(event.start),
          endTime: getISOStringDateTime(event.end),
        })),
      );
    }
  };

  const recurrenceOptions = [
    { label: "None", value: "NONE" },
    { label: "Weekly", value: "WEEKLY" },
    { label: "Bi-weekly", value: "BIWEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
  ];

  return (
    <Container maxW="container.xl">
      <VStack w="full" spacing={5} alignItems="flex-start" p={10}>
        <FormHeader symbol="2" title="Scheduling Time Slots" />
        <VStack spacing={30} alignItems="flex-start" px={2}>
          <Text textStyle="caption">
            {ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS}
          </Text>
          <FormControl isRequired isInvalid={recurrenceIntervalError}>
            <FormLabel textStyle="body-regular">Recurrence Frequency</FormLabel>
            <Flex alignItems="flex-start">
              <VStack spacing={2} alignItems="flex-end">
                <Select
                  placeholder="How often will this occur?"
                  size="sm"
                  width="425px"
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
                <FormErrorMessage>Please select a frequency.</FormErrorMessage>
              </VStack>
            </Flex>
          </FormControl>
          <VStack spacing={2} alignItems="flex-start">
            <Text textStyle="body-regular" fontWeight="medium">
              Select Start and End Dates
            </Text>
            <HStack spacing={5} alignItems="flex-start">
              <FormControl isRequired isInvalid={startDateError}>
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
                    <FormErrorMessage>
                      Please enter a valid date.
                    </FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
              <FormControl isRequired isInvalid={endDateError}>
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
                    <FormErrorMessage>
                      Please enter a valid date.
                    </FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
            </HStack>
          </VStack>
          <VStack spacing={2}>
            <FormControl isRequired isInvalid={eventsError}>
              <FormLabel textStyle="body-regular">Select Shift Times</FormLabel>
              <Text textStyle="caption">
                {ADMIN_POSTING_CREATE_SHIFTS_TIME}
              </Text>
              <FormErrorMessage>
                Please select at least one shift time.
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </VStack>
      </VStack>
      <ShiftCalendar
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        addEvent={addEvent}
        changeEvent={changeEvent}
        deleteEvent={deleteEvent}
      />
      <Divider mt="104px" mb="18px" />
      <VStack alignItems="flex-end">
        <Button onClick={handleNext}>Next</Button>
      </VStack>
    </Container>
  );
};

export default CreatePostingShifts;

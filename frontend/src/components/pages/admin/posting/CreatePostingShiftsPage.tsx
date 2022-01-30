import { DateSelectArg } from "@fullcalendar/react";
import React, { useState } from "react";
import { Container, Divider } from "@chakra-ui/react";
import ShiftCalendar, {
  Event,
} from "../../../admin/ShiftCalendar/ShiftCalendar";
import CreatePostingShifts from "../../../admin/posting/CreatePostingShifts";

const CreatePostingShiftsPage = (): React.ReactElement => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventCount, setEventCount] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  return (
    <Container maxW="container.lg">
      <CreatePostingShifts />
      <ShiftCalendar
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        addEvent={addEvent}
        changeEvent={changeEvent}
        deleteEvent={deleteEvent}
      />
      <Divider my={4} />
    </Container>
  );
};

export default CreatePostingShiftsPage;

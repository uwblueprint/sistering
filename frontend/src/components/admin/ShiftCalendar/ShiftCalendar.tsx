import FullCalendar, {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
  EventRemoveArg,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import colors from "../../../theme/colors";
import "./ShiftCalendar.css";

type Event = {
  id: string;
  start: Date;
  end: Date;
};

const ShiftCalendar = (): React.ReactElement => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [eventCount, setEventCount] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

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

  const changeEvent = (event: Event, oldEvent: Event) => {
    // Slice changes the ref of the event so that events is not mutated.
    const newEvents = events.slice();
    for (let i = 0; i < newEvents.length; i += 1) {
      if (newEvents[i].id === oldEvent.id) {
        newEvents[i].start = event.start;
        newEvents[i].end = event.end;
        break;
      }
    }
    setEvents(newEvents);
  };

  const deleteEvent = () => {
    if (selectedEvent) {
      // Slice changes the ref of the event so that events is not mutated.
      const newEvents = events.slice();
      for (let i = 0; i < newEvents.length; i += 1) {
        if (newEvents[i].id === selectedEvent.id) {
          newEvents.splice(i, 1);
          break;
        }
      }
      setEvents(newEvents);
      closeModal();
    }
  };

  const deleteDialog = (event: Event) => {
    openModal();
    setSelectedEvent(event);
  };

  console.log(events);

  return (
    <Box>
      <Modal onClose={closeModal} isOpen={isModalOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt={3}>Delete Shift?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent
              ? `Are you sure you want to delete the event on ${moment(
                  selectedEvent.start,
                ).format("dddd")} from ${moment(selectedEvent.start).format(
                  "hh:mm A",
                )} to ${moment(selectedEvent.end).format("hh:mm A")}?`
              : ""}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={closeModal}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteEvent}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <FullCalendar
        allDaySlot={false}
        dayHeaderFormat={{ weekday: "short" }}
        editable
        eventChange={(arg: EventChangeArg) =>
          changeEvent(arg.event as Event, arg.oldEvent as Event)
        }
        eventClick={(arg: EventClickArg) => deleteDialog(arg.event as Event)}
        eventColor={colors.violet}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        events={events as EventInput[]}
        headerToolbar={false}
        initialView="timeGridWeek"
        plugins={[timeGridPlugin, interactionPlugin]}
        select={(selectInfo: DateSelectArg) => addEvent(selectInfo)}
        selectMirror
        selectable
        slotDuration="00:15:00"
        slotLabelInterval="01:00"
      />
    </Box>
  );
};

export default ShiftCalendar;

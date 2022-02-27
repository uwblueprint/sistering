import FullCalendar, {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import React, { useState } from "react";
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

type ShiftCalendarProps = {
  eventsProp: Event[];
};

const ShiftCalendar = ({
  eventsProp,
}: ShiftCalendarProps): React.ReactElement => {
  const [events, setEvents] = useState<Event[]>(eventsProp);
  const [eventCount, setEventCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
      closeModal();
    }
  };

  const deleteDialog = (event: Event) => {
    openModal();
    setSelectedEvent(event);
  };

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
            <Button colorScheme="red" onClick={() => deleteEvent(events)}>
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
          changeEvent(arg.event as Event, arg.oldEvent as Event, events)
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
        scrollTime="09:00:00"
        slotDuration="00:15:00"
        slotLabelInterval="01:00"
      />
    </Box>
  );
};

export default ShiftCalendar;

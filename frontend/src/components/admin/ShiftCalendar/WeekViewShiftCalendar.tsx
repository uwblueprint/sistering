import FullCalendar, {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
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
import { Event } from "../../../types/CalendarTypes";
import "./Calendar.css";
import { getTime, getWeekday } from "../../../utils/DateTimeUtils";

type ShiftCalendarProps = {
  events: Event[];
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  addEvent: (newEvent: DateSelectArg) => void;
  changeEvent: (event: Event, oldEvent: Event, currEvents: Event[]) => void;
  deleteEvent: (currEvents: Event[]) => void;
  initialDate?: string;
};

const WeekViewShiftCalendar = ({
  events,
  selectedEvent,
  setSelectedEvent,
  addEvent,
  changeEvent,
  deleteEvent,
  initialDate,
}: ShiftCalendarProps): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const deleteDialog = (event: Event) => {
    openModal();
    setSelectedEvent(event);
  };

  const onDeleteEvent = (currEvents: Event[]) => {
    deleteEvent(currEvents);
    closeModal();
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
              ? `Are you sure you want to delete the event on ${getWeekday(
                  selectedEvent.start,
                )} from ${getTime(selectedEvent.start)} to ${getTime(
                  selectedEvent.end,
                )}?`
              : ""}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={closeModal}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => onDeleteEvent(events.slice())}
            >
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
          changeEvent(arg.event as Event, arg.oldEvent as Event, events.slice())
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
        timeZone="UTC"
        initialDate={initialDate}
        selectConstraint={{
          startTime: "0:00",
          endTime: "24:00",
        }}
      />
    </Box>
  );
};

export default WeekViewShiftCalendar;

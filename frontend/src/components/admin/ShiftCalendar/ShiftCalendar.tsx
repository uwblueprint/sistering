import FullCalendar, {
  DateSelectArg,
  EventChangeArg,
  EventInput,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import colors from "../../../theme/colors";
import "./ShiftCalendar.css";

type Event = {
  start: Date;
  end: Date;
};

const ShiftCalendar = (): React.ReactElement => {
  const [events, setEvents] = React.useState<Event[]>([
    {
      start: new Date("2022-02-10T12:00"),
      end: new Date("2022-02-10T14:00"),
    },
    {
      start: new Date("2022-02-09T14:00"),
      end: new Date("2022-02-09T16:00"),
    },
  ]);

  const addEvent = (newEvent: DateSelectArg) => {
    setEvents([
      ...events,
      {
        start: newEvent.start,
        end: newEvent.end,
      },
    ]);
  };

  const changeEvent = (event: Event, oldEvent: Event) => {
    const newEvents = events;
    for (let i = 0; i < newEvents.length; i += 1) {
      if (
        newEvents[i].start.getTime() === oldEvent.start.getTime() &&
        newEvents[i].end.getTime() === oldEvent.end.getTime()
      ) {
        newEvents[i].start = event.start;
        newEvents[i].end = event.end;
        break;
      }
    }
    setEvents(newEvents);
    // TODO: remove this later
    console.log(newEvents);
  };

  // TODO: remove this later
  console.log(events);

  return (
    <FullCalendar
      allDaySlot={false}
      dayHeaderFormat={{ weekday: "short" }}
      editable
      eventChange={(arg: EventChangeArg) =>
        changeEvent(arg.event as Event, arg.oldEvent as Event)
      }
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
  );
};

export default ShiftCalendar;

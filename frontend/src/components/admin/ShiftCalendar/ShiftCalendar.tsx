import FullCalendar, {
  DateSelectArg,
  EventChangeArg,
  EventInput,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";

type Event = {
  start: Date;
  end: Date;
};

const ShiftCalendar = (): React.ReactElement => {
  const [events, setEvents] = React.useState<Event[]>([
    {
      start: new Date("2022-01-30T12:00"),
      end: new Date("2022-01-30T14:00"),
    },
    {
      start: new Date("2022-02-01T14:00"),
      end: new Date("2022-02-01T16:00"),
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
      plugins={[timeGridPlugin, interactionPlugin]}
      dayHeaderFormat={{ weekday: "short" }}
      headerToolbar={false}
      initialView="timeGridWeek"
      allDaySlot={false}
      events={events as EventInput[]}
      eventChange={(arg: EventChangeArg) =>
        changeEvent(arg.event as Event, arg.oldEvent as Event)
      }
      editable
      select={(selectInfo: DateSelectArg) => addEvent(selectInfo)}
      selectable
      selectMirror
    />
  );
};

export default ShiftCalendar;

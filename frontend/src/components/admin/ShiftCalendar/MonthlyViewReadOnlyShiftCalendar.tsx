import React from "react";
import FullCalendar, {
  DayCellContentArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@chakra-ui/react";

import { Event, MonthEvent } from "../../../types/CalendarTypes";
import colors from "../../../theme/colors";
import "./Calendar.css";

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
    start: new Date("2022-03-01 10:00:00 UTC"),
    end: new Date("2022-03-01 11:30:00 UTC"),
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
    start: new Date("2022-03-01 17:15:00 UTC"),
    end: new Date("2022-03-01 19:00:00 UTC"),
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
    start: new Date("2022-03-17 11:00:00 UTC"),
    end: new Date("2022-03-17 13:00:00 UTC"),
  },
  {
    id: "7",
    groupId: "saved",
    start: new Date("2022-03-17 09:00:00 UTC"),
    end: new Date("2022-03-17 11:00:00 UTC"),
  },
  {
    id: "7",
    groupId: "unsaved",
    start: new Date("2022-03-17 13:00:00 UTC"),
    end: new Date("2022-03-17 15:00:00 UTC"),
  },
];

// Events can be passed in any order (does not have to be sorted).
// AdminShiftCalendar assumes that all events are in the same month.
type AdminShiftCalendarProps = {
  events: Event[];
};

const MonthlyViewShiftCalendar = ({
  events,
}: AdminShiftCalendarProps): React.ReactElement => {
  const displayCustomEvent = (content: EventContentArg) => {
    return (
      <>
        {content.event.groupId === "saved" ? (
          <div className="fc-daygrid-event-dot fc-event-saved" />
        ) : (
          <div className="fc-daygrid-event-dot fc-event-unsaved" />
        )}

        {content.timeText}
      </>
    );
  };

  // applyCellClasses is used to compute the day cell background color.
  const applyCellClasses = (day: DayCellContentArg) => {
    // FullCalendar doesn't support retrieving events of a day, so we have to
    // iterate through all events to find the ones that match the day.
    const dayEvents = events.filter((event) => {
      return event.start?.getUTCDate() === day.date.getUTCDate();
    });

    return dayEvents.length > 0 ? "fc-day-has-event" : "fc-day-no-events";
  };

  return (
    <Box id="admin-calendar" padding="16px 47px">
      <FullCalendar
        dayMaxEvents={3}
        displayEventEnd
        dayCellClassNames={(day: DayCellContentArg) => applyCellClasses(day)}
        editable
        // eventClick --> Show side panel, TODO in ticket #176
        eventColor={colors.violet}
        eventContent={displayCustomEvent}
        events={events as EventInput[]}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        fixedWeekCount={false}
        headerToolbar={false}
        initialDate={events.length > 0 ? events[0].start : new Date()}
        initialView="dayGridMonth"
        plugins={[dayGridPlugin]}
        selectMirror
        selectable
        timeZone="UTC"
      />
    </Box>
  );
};

export default MonthlyViewShiftCalendar;

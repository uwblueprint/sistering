import React, { useEffect } from "react";
import FullCalendar, {
  DayCellContentArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@chakra-ui/react";

import { Event } from "../../../types/CalendarTypes";
import colors from "../../../theme/colors";
import "./Calendar.css";

// Events can be passed in any order (does not have to be sorted).
// AdminShiftCalendar assumes that all events are in the same month.
type AdminShiftCalendarProps = {
  events: Event[];
};

const MonthlyViewShiftCalendar = ({
  events,
}: AdminShiftCalendarProps): React.ReactElement => {
  const calendarRef = React.useRef<FullCalendar>(null);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi && events.length > 0) {
      calendarApi.gotoDate(events[0].start);
    }
  });

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
        selectable
        ref={calendarRef}
        timeZone="UTC"
      />
    </Box>
  );
};

export default MonthlyViewShiftCalendar;

import React, { useEffect } from "react";
import FullCalendar, {
  DayCellContentArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@chakra-ui/react";

import { Event } from "../../../types/CalendarTypes";
import colors from "../../../theme/colors";
import "./Calendar.css";
import { AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO } from "../../../types/api/ShiftTypes";

// Events can be passed in any order (does not have to be sorted).
// AdminShiftCalendar assumes that all events are in the same month.
type AdminShiftCalendarProps = {
  events: Event[];
  shifts: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO[];
  initialDate: Date;
  onDayClick: (calendarDay: Date) => void;
  onShiftClick: (
    shift: AdminScheduleShiftWithSignupAndVolunteerGraphQLResponseDTO,
  ) => void;
};

const MonthlyViewShiftCalendar = ({
  events,
  shifts,
  initialDate,
  onDayClick,
  onShiftClick,
}: AdminShiftCalendarProps): React.ReactElement => {
  const calendarRef = React.useRef<FullCalendar>(null);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(initialDate);
    }
  });

  const displayCustomEvent = (content: EventContentArg) => {
    const shift = shifts.find((currShift) => currShift.id === content.event.id);
    if (shift) {
      const isConfirmed = shift.signups.some(
        ({ status }) => status === "CONFIRMED" || status === "PUBLISHED",
      );
      return (
        <>
          {isConfirmed ? (
            <div className="fc-daygrid-event-dot fc-event-confirmed" />
          ) : (
            <div className="fc-daygrid-event-dot fc-event-unconfirmed" />
          )}

          {content.timeText}
        </>
      );
    }
    return (
      <>
        <div className="fc-daygrid-event-dot fc-event-unconfirmed" />
        {content.timeText}
      </>
    );
  };

  const onEventClick = (click: EventClickArg) => {
    const shift = shifts.find((currShift) => currShift.id === click.event.id);
    if (shift) {
      onDayClick(shift.startTime);
      onShiftClick(shift);
    }
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
        dateClick={({ date }) => onDayClick(date)}
        eventClick={onEventClick}
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
        initialDate={initialDate}
        initialView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin]}
        selectable
        ref={calendarRef}
        timeZone="UTC"
      />
    </Box>
  );
};

export default MonthlyViewShiftCalendar;

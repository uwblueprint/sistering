import moment from "moment";
import { RecurrenceInterval } from "../types";

export const addDays = (date: Date, daysToAdd: number): Date => {
  return new Date(new Date().setDate(date.getDate() + daysToAdd));
};

export const setTime = (date: Date, hours: number, minutes: number): Date => {
  return new Date(date.setHours(hours, minutes));
};

export const getWeekDiff = (start: Date, end: Date): number => {
  return moment(end)
    .startOf("week")
    .diff(moment(start).startOf("week").toDate(), "week", false);
};
    
export const getInterval = (recurrence: RecurrenceInterval): number => {
  const WEEK_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;
  // Return interval in milliseconds
  switch (recurrence) {
    case "NONE": // No recurrence
      return 0;
    case "WEEKLY": // Weekly
      return WEEK_IN_MILLISECONDS;
    case "BIWEEKLY": // Biweekly
      return WEEK_IN_MILLISECONDS * 2;
    case "MONTHLY": // Monthly
      return WEEK_IN_MILLISECONDS * 4;
    default:
      throw new Error(`Invalid recurrence ${recurrence}`);
   }
};
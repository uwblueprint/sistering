import moment from "moment";

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

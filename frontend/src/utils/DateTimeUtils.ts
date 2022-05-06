import moment from "moment";
import { FilterType } from "../types/DateFilterTypes";

// REFERENCE: https://momentjs.com/docs/#/displaying/

/**
 * @param {Date} date
 * @returns corresponding time string string in format hh:mm:(a/p)m
 */
export const formatTimeHourMinutes = (date: Date): string => {
  return moment(date).utc().format("h:mm a");
};

/**
 *
 * @param {Date} start
 * @param {Date} end
 * @returns the difference in hours between the end and start date to the nearest quarter hour (ex: 2, 2.25, 2.50, 2.75)
 */
export const getElapsedHours = (start: Date, end: Date): number => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  // duration.asHours returns the hour difference with infinite decimal precision
  // however, we want 2 decimal quarter precision
  // ex. if duration.asHours() = 1.71333333 -> durationAsHours = 1.75
  const durationAsHours = (Math.round(duration.asHours() * 4) / 4).toFixed(2);
  return parseFloat(durationAsHours);
};

/**
 * @param {string} dateStringInput date string on frontend
 * @returns corresponding date string in the following format (Monday, Oct 13, 2021)
 */
export const formatDateStringYear = (dateStringInput: string): string => {
  const inputAsDate = new Date(dateStringInput);
  return moment(inputAsDate).utc().format("dddd, ll");
};

/**
 * @param {string} dateStringInput date string on frontend
 * @returns corresponding date string in the following format (Monday, Oct 13)
 */
export const formatDateMonthDay = (dateStringInput: string): string => {
  const inputAsDate = new Date(dateStringInput);
  return moment(inputAsDate).format("dddd, MMM D");
};

/**
 * currently only supports filter by week and month
 * @param start a date string on the frontend
 * @param filterType type of filter (week or month)
 * @returns a boolean representing whether the specified date is within the range
 */
export const dateInRange = (start: string, filterType: FilterType): boolean => {
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const startDate = new Date(start);
  return (
    startDate.getTime() - Date.now() >= 0 &&
    startDate.getTime() - Date.now() <
      (filterType === "week" ? MS_PER_WEEK : MS_PER_WEEK * 4)
  );
};

export const getWeekday = (dateStringInput: Date): string => {
  return moment(dateStringInput).utc().format("dddd");
};

export const getTime = (dateStringInput: Date): string => {
  return moment(dateStringInput).utc().format("hh:mm A");
};

/**
 * @param date a date object
 * @returns a string representation of the date in YYYY-MM-DDTHH:mm format
 */
export const getISOStringDateTime = (date: Date): string => {
  return date.toISOString().substring(0, 16);
};

/**
 * Gets the date of the previous Sunday in YYYY-MM-DD format.
 * If {@link date} is a Sunday, the same date is returned.
 * @param date a date string in YYYY-MM-DD format
 * @returns the date of the previous Sunday in YYYY-MM-DD format
 */
export const getPreviousSunday = (dateString: string): string => {
  const date = new Date(dateString);
  const previousSunday = moment(date).utc().startOf("week");
  return previousSunday.toDate().toISOString().substring(0, 10);
};

/**
 * Gets the date of the next Sunday in YYYY-MM-DD format.
 * If {@link date} is a Sunday, the date of the next Sunday is returned.
 * @param date a date string in YYYY-MM-DD format
 * @returns the date of the next Saturday in YYYY-MM-DD format
 */
export const getNextSunday = (dateString: string): string => {
  const date = new Date(dateString);
  const nextSunday = moment(date).utc().startOf("week").add(1, "weeks");
  return nextSunday.toDate().toISOString().substring(0, 10);
};

/**
 * Returns a Date object representation of the {@link dateTimeString} in UTC.
 * Context: We use a custom datetime format in our backend (YYYY-MM-DDTHH:mm)
 * which does not automatically parse to UTC.
 * @param dateTimeString a datetime string in YYYY-MM-DDTHH:mm format
 * @returns the Date object representation of the {@link dateTimeString} in UTC
 */
export const getUTCDateForDateTimeString = (dateTimeString: string): Date => {
  // using ISO 8601 date-time form with timezone specifier
  return new Date(`${dateTimeString}:00+00:00`);
};

/**
 * get integer difference of days between 2 dates (end - start)
 * @param  {Date} start
 * @param  {Date} end
 * @returns number
 */
export const getDayDiff = (start: Date, end: Date): number => {
  return moment(end).diff(start, "days", false);
};

/**
 * get integer difference of weeks between 2 dates (end - start)
 * @param  {Date} start
 * @param  {Date} end
 * @returns number
 */
export const getWeekDiff = (start: Date, end: Date): number => {
  return moment(end)
    .startOf("week")
    .diff(moment(start).startOf("week").toDate(), "week", false);
};

/**
 * get integer difference of months between 2 dates (end - start)
 * @param  {Date} start
 * @param  {Date} end
 * @returns number
 */
export const getMonthDiff = (start: Date, end: Date): number => {
  return moment(end)
    .startOf("month")
    .diff(moment(start).startOf("month").toDate(), "month", false);
};

/**
 * get the first day of a month
 */
export const getFirstDayOfMonth = (date: Date): Date => {
  return moment(date).startOf("month").toDate();
};

/**
 * Gets all months within the range of startDate and endDate
 * @param startDate the start date of the range
 * @param endDate the end date of the range
 * @returns an array of months in between startDate and endDate
 */
export const getMonthsInRange = (startDate: Date, endDate: Date): Date[] => {
  const monthsInRange: Date[] = [];
  let currentMonth = moment(startDate).startOf("month");
  const endMonth = moment(endDate).endOf("month");
  while (currentMonth.isBefore(endMonth)) {
    monthsInRange.push(currentMonth.toDate());
    currentMonth = currentMonth.add(1, "month");
  }
  return monthsInRange;
};

/*
 * get the earliest date from an array of dates
 */
export const getEarliestDate = (dates: Date[]): Date => {
  return dates.reduce((a, b) => (a < b ? a : b));
};

/**
 * get the latest date from an array of dates
 */
export const getLatestDate = (dates: Date[]): Date => {
  return dates.reduce((a, b) => (a > b ? a : b));
};

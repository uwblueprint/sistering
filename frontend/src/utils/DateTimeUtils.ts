import moment from "moment";
import { FilterType } from "../types/DateFilterTypes";

// eslint-disable-next-line import/prefer-default-export
export const formatDateString = (dateStringInput: string): string => {
  const date = new Date(dateStringInput);
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const formatDateStringWithYear = (dateStringInput: string): string => {
  const date = new Date(dateStringInput);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

// currently only supports filter by week and month
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
  return moment(dateStringInput).format("dddd");
};

export const getTime = (dateStringInput: Date): string => {
  return moment(dateStringInput).format("hh:mm A");
};

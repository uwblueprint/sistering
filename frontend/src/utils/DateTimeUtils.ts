import moment from 'moment';

/**
 * @param {Date} date 
 * @returns corresponding time string string in format hh:mm:(a/p)m
 */
 export const formatTimeHourMinutes = (date: Date):string => {
  return moment(date).format('h:mm a');
}

/**
 * 
 * @param {Date} start 
 * @param {Date} end 
 * @returns the difference in hours between the end and start date
 */
export const getElapsedHours = (start: Date, end: Date): number => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  // what should be the decimal precision?
  return duration.asHours();

}

/**
 * @param {Date} date 
 * @returns corresponding date string in the following format (Monday, Oct 13, 2021)
 */
export const formatDateStringYear = (dateStringInput: Date): string => {
  return moment(dateStringInput).format('dddd, ll')
}


// eslint-disable-next-line import/prefer-default-export
export const formatDateString = (dateStringInput: Date): string => {
  const date = new Date(dateStringInput);
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

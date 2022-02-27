// these helper functions are now unused, should this file be deleted?

/**
 * Time in minutes is minutes from 0:00, convert to something like "1:23 am"
 * @param timeInMinutes the minutes to convert
 * @returns the corresponding time string (AM/PM)
 */
export function convertToAmPm(timeInMinutes: number): string {
  return `${(Math.floor(timeInMinutes / 60) % 12 === 0
    ? 12
    : Math.floor(timeInMinutes / 60) % 12
  ).toString()}:${`0${timeInMinutes % 60}`.slice(-2)}${
    timeInMinutes >= 720 ? "pm" : "am"
  }`;
}

/**
 * totalMinutes gets the total minutes of a time in a date, counting hours in minutes
 * @param  {Date} date
 * @returns number
 */
export function totalMinutes(date: Date): number {
  return date.getMinutes() + date.getHours() * 60;
}

/**
 * elapsedHours gets elapsed number of hours given start/end as an integer
 * @param  {Date} start
 * @param  {Date} end
 * @returns number
 */
export function elapsedHours(start: Date, end: Date): number {
  return Math.round(Math.abs(totalMinutes(end) - totalMinutes(start)) / 60);
}

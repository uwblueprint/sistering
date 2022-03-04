export const addDays = (date: Date, daysToAdd: number): Date => {
  return new Date(new Date().setDate(date.getDate() + daysToAdd));
};

export const setTime = (date: Date, hours: number, minutes: number): Date => {
  return new Date(date.setHours(hours, minutes));
};

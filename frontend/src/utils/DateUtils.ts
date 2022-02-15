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

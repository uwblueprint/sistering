export type Event = {
  id: string;
  start: Date;
  end: Date;
};

export type MonthEvent = Event & {
  groupId: string;
};

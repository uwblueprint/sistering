import {
  ADMIN_SCHEDULE_POSTINGS_PAGE,
  ADMIN_USER_MANAGMENT_PAGE,
  VOLUNTEER_SHIFTS_PAGE,
  VOLUNTEER_POSTINGS_PAGE,
} from "./Routes";

export const AdminNavbarTabs = [
  {
    name: "Volunteer Postings",
    route: ADMIN_SCHEDULE_POSTINGS_PAGE,
  },
  {
    name: "User Management",
    route: ADMIN_USER_MANAGMENT_PAGE,
  },
];

export enum AdminPages {
  AdminSchedulePosting,
  AdminUserManagement,
}

export const VolunteerNavbarTabs = [
  {
    name: "My Shifts",
    route: VOLUNTEER_SHIFTS_PAGE,
  },
  {
    name: "Browse Volunteer Postings",
    route: VOLUNTEER_POSTINGS_PAGE,
  },
];

export enum VolunteerPages {
  VolunteerShifts,
  VolunteerPostings,
}

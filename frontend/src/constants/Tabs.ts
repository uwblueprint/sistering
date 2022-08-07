import {
  ADMIN_HOMEPAGE,
  ADMIN_USER_MANAGMENT_PAGE,
  VOLUNTEER_SHIFTS_PAGE,
  VOLUNTEER_POSTINGS_PAGE,
} from "./Routes";

export const AdminNavbarTabs = [
  {
    name: "Volunteer Postings",
    route: ADMIN_HOMEPAGE,
  },
  {
    name: "User Management",
    route: ADMIN_USER_MANAGMENT_PAGE,
  },
];

export const EmployeeNavbarTabs = [
  {
    name: "Volunteer Postings",
    route: ADMIN_HOMEPAGE,
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

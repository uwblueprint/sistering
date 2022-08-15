import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState, useReducer, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { hotjar } from "react-hotjar";
import ReactGA from "react-ga";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import DoneResetPassword from "./components/auth/DoneResetPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import Default from "./components/pages/Default";
import NotFound from "./components/pages/NotFound";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import PostingContext, {
  DEFAULT_POSTING_CONTEXT,
} from "./contexts/admin/PostingContext";
import postingContextReducer from "./reducers/PostingContextReducer";
import PostingContextDispatcherContext from "./contexts/admin/PostingContextDispatcherContext";
import VolunteerPostingsPage from "./components/pages/volunteer/posting/VolunteerPostingsPage";
import VolunteerPostingDetails from "./components/pages/volunteer/posting/VolunteerPostingDetails";
import AdminPostingDetails from "./components/pages/admin/posting/AdminPostingDetails";

import customTheme from "./theme";
import { AuthenticatedUser, Role } from "./types/AuthTypes";
import VolunteerShiftsPage from "./components/pages/volunteer/shift/VolunteerShiftsPage";
import SchedulePostingPage from "./components/pages/admin/schedule/SchedulePostingPage";
import VolunteerPostingAvailabilities from "./components/pages/volunteer/posting/VolunteerPostingAvailabilities";
import AdminSchedulePostingReviewPage from "./components/pages/admin/schedule/AdminSchedulePostingReviewPage";
import CreateAccountPage from "./components/pages/CreateAccountPage";
import PasswordResetSuccessPage from "./components/auth/PasswordResetSuccess";
import NewAccountPage from "./components/pages/NewAccountPage";
import AccountCreatedPage from "./components/pages/AccountCreatedPage";
import AdminHomepage from "./components/pages/admin/AdminHomepage";
import AdminUserManagementPage from "./components/pages/admin/user/AdminUserManagementPage";
import CreatePostingPage from "./components/pages/admin/posting/CreatePostingPage";
import EditAccountPage from "./components/pages/EditAccountPage";
import EditPostingPage from "./components/pages/admin/posting/EditPostingPage";
import OrgWideCalendar from "./components/admin/calendar/OrgWideCalendar";

// Consts for Hotjar and Google Analytics (this is ok to expose)
const TRACKING_ID = "G-DF2BP4T8YQ";
const HJID = 2949419;
const HSJV = 6;

ReactGA.initialize(TRACKING_ID);

const App = (): React.ReactElement => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    hotjar.initialize(HJID, HSJV);
  }, []);

  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  const [postingContext, dispatchPostingContextUpdate] = useReducer(
    postingContextReducer,
    DEFAULT_POSTING_CONTEXT,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
        <PostingContext.Provider value={postingContext}>
          <PostingContextDispatcherContext.Provider
            value={dispatchPostingContextUpdate}
          >
            <Router>
              <Switch>
                <PrivateRoute
                  exact
                  path={Routes.HOME_PAGE}
                  component={Default}
                />
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route
                  exact
                  path={Routes.CREATE_ACCOUNT_PAGE}
                  component={CreateAccountPage}
                />
                <Route
                  exact
                  path={Routes.ACCOUNT_CREATED_PAGE}
                  component={AccountCreatedPage}
                />
                <Route
                  exact
                  path={Routes.NEW_ACCOUNT_PAGE}
                  component={NewAccountPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.EDIT_ACCOUNT_PAGE}
                  component={EditAccountPage}
                />
                <Route
                  exact
                  path={Routes.RESET_PASSWORD_PAGE}
                  component={ResetPassword}
                />
                <Route
                  exact
                  path={Routes.RESET_PASSWORD_SUCCESS_PAGE}
                  component={PasswordResetSuccessPage}
                />
                <Route
                  exact
                  path={Routes.DONE_RESET_PASSWORD_PAGE}
                  component={DoneResetPassword}
                />
                <PrivateRoute
                  exact
                  path={Routes.NOT_FOUND_PAGE}
                  component={NotFound}
                />
                <PrivateRoute
                  exact
                  path={Routes.VOLUNTEER_POSTINGS_PAGE}
                  authorizedRoles={[Role.Volunteer]}
                  component={VolunteerPostingsPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.VOLUNTEER_POSTING_DETAILS}
                  authorizedRoles={[Role.Volunteer]}
                  component={VolunteerPostingDetails}
                />
                <PrivateRoute
                  exact
                  path={Routes.VOLUNTEER_POSTING_AVAILABILITIES}
                  authorizedRoles={[Role.Volunteer]}
                  component={VolunteerPostingAvailabilities}
                />
                <PrivateRoute
                  exact
                  path={Routes.VOLUNTEER_SHIFTS_PAGE}
                  authorizedRoles={[Role.Volunteer]}
                  component={VolunteerShiftsPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_HOMEPAGE}
                  authorizedRoles={[Role.Admin, Role.Employee]}
                  component={AdminHomepage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_ORG_WIDE_CALENDAR}
                  authorizedRoles={[Role.Admin, Role.Employee]}
                  component={OrgWideCalendar}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_USER_MANAGMENT_PAGE}
                  authorizedRoles={[Role.Admin]}
                  component={AdminUserManagementPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_CREATE_POSTING_PAGE}
                  authorizedRoles={[Role.Admin]}
                  component={CreatePostingPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_EDIT_POSTING_PAGE}
                  authorizedRoles={[Role.Admin]}
                  component={EditPostingPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_POSTING_DETAILS}
                  authorizedRoles={[Role.Admin, Role.Employee]}
                  component={AdminPostingDetails}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_SCHEDULE_POSTING_PAGE}
                  authorizedRoles={[Role.Admin, Role.Employee]}
                  component={SchedulePostingPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ADMIN_SCHEDULE_POSTING_REVIEW_PAGE}
                  authorizedRoles={[Role.Admin]}
                  component={AdminSchedulePostingReviewPage}
                />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </Router>
          </PostingContextDispatcherContext.Provider>
        </PostingContext.Provider>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;

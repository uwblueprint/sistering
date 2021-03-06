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
import Signup from "./components/auth/Signup";
import ResetPassword from "./components/auth/ResetPassword";
import DoneResetPassword from "./components/auth/DoneResetPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import PostingContext, {
  DEFAULT_POSTING_CONTEXT,
} from "./contexts/admin/PostingContext";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import postingContextReducer from "./reducers/PostingContextReducer";
import sampleContextReducer from "./reducers/SampleContextReducer";
import PostingContextDispatcherContext from "./contexts/admin/PostingContextDispatcherContext";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";
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

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  const [postingContext, dispatchPostingContextUpdate] = useReducer(
    postingContextReducer,
    DEFAULT_POSTING_CONTEXT,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <SampleContext.Provider value={sampleContext}>
        <SampleContextDispatcherContext.Provider
          value={dispatchSampleContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <PostingContext.Provider value={postingContext}>
              <PostingContextDispatcherContext.Provider
                value={dispatchPostingContextUpdate}
              >
                <Router>
                  <Switch>
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
                    <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
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
                      path={Routes.ADMIN_HOMEPAGE}
                      authorizedRoles={[Role.Admin]}
                      component={AdminHomepage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.EDIT_ACCOUNT_PAGE}
                      component={EditAccountPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.HOME_PAGE}
                      component={Default}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.CREATE_ENTITY_PAGE}
                      component={CreatePage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.UPDATE_ENTITY_PAGE}
                      component={UpdatePage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.DISPLAY_ENTITY_PAGE}
                      component={DisplayPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.EDIT_TEAM_PAGE}
                      component={EditTeamInfoPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.HOOKS_PAGE}
                      component={HooksDemo}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.VOLUNTEER_POSTINGS_PAGE}
                      authorizedRoles={[Role.Volunteer]}
                      component={VolunteerPostingsPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.VOLUNTEER_SHIFTS_PAGE}
                      authorizedRoles={[Role.Volunteer]}
                      component={VolunteerShiftsPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_CREATE_POSTING_PAGE}
                      authorizedRoles={[Role.Admin]}
                      component={CreatePostingPage}
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
                      path={Routes.ADMIN_POSTING_DETAILS}
                      authorizedRoles={[Role.Admin]}
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
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_USER_MANAGMENT_PAGE}
                      authorizedRoles={[Role.Admin]}
                      component={AdminUserManagementPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.NOT_FOUND_PAGE}
                      component={NotFound}
                    />
                    <Route exact path="*" component={NotFound} />
                  </Switch>
                </Router>
              </PostingContextDispatcherContext.Provider>
            </PostingContext.Provider>
          </AuthContext.Provider>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;

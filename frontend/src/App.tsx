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
import CreatePostingBasicInfoPage from "./components/pages/admin/posting/CreatePostingBasicInfoPage";
import CreatePostingShiftsPage from "./components/pages/admin/posting/CreatePostingShiftsPage";
import CreatePostingReviewPage from "./components/pages/admin/posting/CreatePostingReviewPage";
import VolunteerPostingDetails from "./components/pages/volunteer/posting/VolunteerPostingDetails";
import AdminPostingDetails from "./components/pages/admin/posting/AdminPostingDetails";

import customTheme from "./theme";
import { AuthenticatedUser, Role } from "./types/AuthTypes";
import VolunteerShiftsPage from "./components/pages/volunteer/shift/VolunteerShiftsPage";
import AdminSchedulePostingPage from "./components/pages/admin/schedule/AdminSchedulePostingPage";
import VolunteerPostingAvailabilities from "./components/pages/volunteer/posting/VolunteerPostingAvailabilities";
import AdminSchedulePostingReviewPage from "./components/pages/admin/schedule/AdminSchedulePostingReviewPage";
import CreateAccountPage from "./components/pages/CreateAccountPage";
import PasswordResetSuccessPage from "./components/auth/PasswordResetSuccess";

ReactGA.initialize(process.env.TRACKING_ID ?? "");

const App = (): React.ReactElement => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  useEffect(() => {
    hotjar.initialize(
      parseInt(process.env.HJID ?? "0", 10),
      parseInt(process.env.HJSV ?? "0", 10),
    );
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
                      path={Routes.ADMIN_POSTING_CREATE_BASIC_INFO_PAGE}
                      authorizedRoles={[Role.Admin]}
                      component={CreatePostingBasicInfoPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_POSTING_CREATE_SHIFTS_PAGE}
                      authorizedRoles={[Role.Admin]}
                      component={CreatePostingShiftsPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_POSTING_CREATE_REVIEW_PAGE}
                      authorizedRoles={[Role.Admin]}
                      component={CreatePostingReviewPage}
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
                      authorizedRoles={[Role.Admin]}
                      component={AdminSchedulePostingPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_SCHEDULE_POSTING_REVIEW_PAGE}
                      authorizedRoles={[Role.Admin]}
                      component={AdminSchedulePostingReviewPage}
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

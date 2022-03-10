import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

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
import { AuthenticatedUser } from "./types/AuthTypes";
import VolunteerShiftsPage from "./components/pages/volunteer/shift/VolunteerShiftsPage";

const App = (): React.ReactElement => {
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
                    <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                    <Route
                      exact
                      path={Routes.RESET_PASSWORD_PAGE}
                      component={ResetPassword}
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
                      component={VolunteerPostingsPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.VOLUNTEER_SHIFTS_PAGE}
                      component={VolunteerShiftsPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_POSTING_CREATE_BASIC_INFO_PAGE}
                      component={CreatePostingBasicInfoPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_POSTING_CREATE_SHIFTS_PAGE}
                      component={CreatePostingShiftsPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_POSTING_CREATE_REVIEW_PAGE}
                      component={CreatePostingReviewPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.VOLUNTEER_POSTING_DETAILS}
                      component={VolunteerPostingDetails}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.ADMIN_POSTING_DETAILS}
                      component={AdminPostingDetails}
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

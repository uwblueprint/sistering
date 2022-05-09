import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";
import { Role } from "../../types/AuthTypes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
  authorizedRoles?: Role[];
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
  authorizedRoles = [],
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  const isAuthorized =
    authenticatedUser &&
    (authorizedRoles.length === 0 ||
      authorizedRoles.includes(authenticatedUser.role));

  return isAuthorized ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to={LOGIN_PAGE} />
  );
};

export default PrivateRoute;

import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const Default = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  if (authenticatedUser?.role === Role.Volunteer) {
    return <Redirect to={Routes.VOLUNTEER_POSTINGS_PAGE} />;
  }
  return <Redirect to={Routes.ADMIN_HOMEPAGE} />;
};

export default Default;

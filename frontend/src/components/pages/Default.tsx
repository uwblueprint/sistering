import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Text } from "@chakra-ui/react";

import Logout from "../auth/Logout";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const Default = (): React.ReactElement => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);
  if (authenticatedUser.role === Role.Volunteer) {
    return <Redirect to={Routes.VOLUNTEER_POSTINGS_PAGE} />;
  }


  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <Text textStyle="display-large">Welcome to Sistering</Text>
      <div className="btn-group" style={{ paddingRight: "10px" }}>
        <Logout />
        <Button
          onClick={() =>
            history.push(Routes.ADMIN_POSTING_CREATE_BASIC_INFO_PAGE)
          }
        >
          Create Posting
        </Button>
      </div>
    </div>
  );
};

export default Default;

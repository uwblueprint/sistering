import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Text } from "@chakra-ui/react";

import Logout from "../auth/Logout";

import * as Routes from "../../constants/Routes";

const Default = (): React.ReactElement => {
  const history = useHistory();
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

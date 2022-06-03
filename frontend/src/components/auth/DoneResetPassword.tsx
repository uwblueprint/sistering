import React from "react";
import { Text } from "@chakra-ui/react";
import AuthNavbar from "./AuthNavbar";

const DoneResetPassword = (): React.ReactElement => (
  <div>
    <AuthNavbar />
    <div style={{ textAlign: "center" }}>
      <Text textStyle="display-large">Reset Password</Text>
      <p>
        We have sent you an e-mail. Please contact us if you do not receive it
        within a few minutes.
      </p>
    </div>
  </div>
);

export default DoneResetPassword;

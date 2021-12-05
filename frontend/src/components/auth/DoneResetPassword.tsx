import React from "react";
import { Box } from "@chakra-ui/react";

const DoneResetPassword = (): React.ReactElement => (
  <div style={{ textAlign: "center" }}>
    <Box textStyle="display-large">Reset Password</Box>
    <p>
      We have sent you an e-mail. Please contact us if you do not receive it
      within a few minutes.
    </p>
  </div>
);

export default DoneResetPassword;

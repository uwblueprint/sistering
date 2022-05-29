import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../assets/Sistering_Logo.svg";

import { DONE_RESET_PASSWORD_PAGE } from "../../constants/Routes";
import ErrorModal from "../common/ErrorModal";

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;

const ResetPassword = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const [resetPassword, { error }] = useMutation<{ resetPassword: boolean }>(
    RESET_PASSWORD,
  );

  const onResetPasswordClick = async () => {
    try {
      await resetPassword({ variables: { email } });
      history.push(DONE_RESET_PASSWORD_PAGE);
    } catch (e) {
      /* eslint-disable-next-line no-alert */
      alert("invalid email");
    }
  };

  return (
    <Box>
      {error && <ErrorModal />}
      <Box width="100%" display="flex" flexDirection="row" height="100vh">
        <Box backgroundColor="#fff" flexGrow={4}>
          <Box maxWidth="480px" margin="8vh auto 0 auto">
            <Logo />
            <Box marginLeft="43px" marginRight="43px" marginBottom="36px">
              <Text textStyle="display-large" paddingBottom="24px">
                Reset Password
              </Text>
              <Text
                w="100%"
                align="left"
                textStyle="body-regular"
                fontSize="14px"
                paddingBottom="14px"
              >
                Enter the email address associated with your account to reset
                your password. You may need to check your spam folder.
              </Text>
              <Box pt={4} paddingBottom="24px">
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  w="100%"
                  bg="gray.50"
                />
              </Box>
              <Button width="100%" onClick={onResetPasswordClick}>
                Send Email
              </Button>
            </Box>
          </Box>
        </Box>
        <Box backgroundColor="#f4f4f4" flexGrow={6} />
      </Box>
    </Box>
  );
};

export default ResetPassword;

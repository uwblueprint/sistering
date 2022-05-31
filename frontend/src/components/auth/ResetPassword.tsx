import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Box, Button, Input, Text, Image } from "@chakra-ui/react";
import logo from "../../assets/Sistering_Logo.svg";

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
      alert("Error: Invalid Email");
    }
  };

  return (
    <Box>
      {error && <ErrorModal />}
      <Box width="100%" display="flex" flexDirection="row" height="100vh">
        <Box backgroundColor="background.white" flexGrow={4}>
          <Box maxWidth="480px" mt="8vh" mx="auto">
            <Image src={logo} alt="Sistering logo" h={32} />
            <Box mx="43px" mb="36px">
              <Text textStyle="display-large" paddingBottom="24px">
                Reset Password
              </Text>
              <Text
                w="100%"
                align="left"
                textStyle="body-regular"
                fontSize="14px"
                pb="14px"
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
        <Box backgroundColor="background.light" flexGrow={6} />
      </Box>
    </Box>
  );
};

export default ResetPassword;

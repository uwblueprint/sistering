import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Box, Button, Image, Input, Text, VStack } from "@chakra-ui/react";
import Sistering_Logo from "../../assets/Sistering_Logo.svg";

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
    <VStack>
      {error && <ErrorModal />}
      <Image src={Sistering_Logo} alt="Sistering logo" h={32} />
      <Text textStyle="display-large">Reset Password</Text>
      <Text w={300} align="center">
        Enter the email address associated with your account to reset your
        password. You may need to check your spam folder.
      </Text>
      <Box pt={4}>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          w={400}
          bg="gray.50"
        />
      </Box>
      <Box pt={14}>
        <Button px={10} onClick={onResetPasswordClick}>
          Send Email
        </Button>
      </Box>
    </VStack>
  );
};

export default ResetPassword;

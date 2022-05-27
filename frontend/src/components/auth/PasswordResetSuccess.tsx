import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/Sistering_Logo.svg";

const PasswordResetSuccessPage = (): React.ReactElement => {
  const history = useHistory();

  return (
    <Box display="flex">
      <Box margin="48px auto" textAlign="center">
        <Logo />
        <Text fontSize="xl" fontWeight="bold" marginBottom="24px">
          Password Change Successful!
        </Text>{" "}
        <Text fontSize="l" marginBottom="24px">
          You may now login with your new credentials.
        </Text>{" "}
        <Button
          color="#7000DE"
          width="128px"
          onClick={() => history.push("/login")}
        >
          <Text color="#fff">Login</Text>
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordResetSuccessPage;

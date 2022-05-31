import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../assets/Sistering_Logo.svg";

const DoneResetPassword = (): React.ReactElement => {
  return (
    <Flex
      mx="auto"
      mt="200px"
      direction="column"
      align="center"
      textAlign="center"
    >
      <Logo />
      <Text textStyle="display-large" mb="36px">
        Email Sent !
      </Text>
      <Text textStyle="caption" maxWidth="650px">
        If you have provided us with an existing email you should recieve a
        password reset link from us. Make sure to check your junk email if you
        cannot find it!
      </Text>
    </Flex>
  );
};

export default DoneResetPassword;

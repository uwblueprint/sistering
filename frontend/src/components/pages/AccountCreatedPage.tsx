import React from "react";
import { useHistory } from "react-router-dom";
import { Text, Flex, Button, Image, VStack } from "@chakra-ui/react";
import Sistering_Logo from "../../assets/Sistering_Logo.svg";

const AccountCreatedPage = (): React.ReactElement => {
  const history = useHistory();
  return (
    <Flex align="center" height="100vh">
      <VStack align="center" width="100vw">
        <Image src={Sistering_Logo} alt="Sistering logo" />
        <Text fontSize="xl" fontWeight="bold" mt="20px">
          Account Successfully Created!
        </Text>
        <Text fontSize="sm" mt="20px">
          You may now login with your credentials
        </Text>
        <Button
          m={3}
          variant="solid"
          width="200px"
          onClick={() => history.push(`/login`)}
        >
          Login
        </Button>
      </VStack>
    </Flex>
  );
};

export default AccountCreatedPage;

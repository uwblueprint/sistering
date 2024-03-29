import React from "react";
import { useHistory } from "react-router-dom";
import { Text, Flex, Button } from "@chakra-ui/react";
import { ReactComponent as FrownFace } from "../../assets/Sistering_frown.svg";
import { HOME_PAGE } from "../../constants/Routes";

const NotFound = (): React.ReactElement => {
  const history = useHistory();

  return (
    <Flex
      mx="auto"
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      maxWidth="475px"
    >
      <FrownFace />
      <Text textStyle="display-large" fontWeight="bold" my={8}>
        Oh no! Page not found.
      </Text>
      <Text textStyle="caption" mb={2}>
        Sorry, we can&apos;t find the page you&apos;re looking for.{" "}
      </Text>
      <Text textStyle="caption" mb={8}>
        Press the button below to return to the main page.
      </Text>
      <Button
        fontSize="16px"
        width="70%"
        onClick={() => history.push(HOME_PAGE)}
      >
        Return to main page
      </Button>
    </Flex>
  );
};

export default NotFound;

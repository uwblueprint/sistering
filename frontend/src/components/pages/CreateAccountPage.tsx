import React from "react";
import { Text, Button, Box } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../assets/Sistering_Logo.svg";

const CreateAccountPage = (): React.ReactElement => {
  const onContinue = () => {
    //
  };

  return (
    <Box width="100%" display="flex" flexDirection="row" height="100vh">
      <Box backgroundColor="#fff" flexGrow={4}>
        <Box maxWidth="400px" margin="8vh auto 0 auto">
          <Logo />
          <Box paddingLeft="43px">
            <Text fontSize="xl" fontWeight="bold" marginBottom="12px">
              Welcome to Sistering!
            </Text>
            <Text marginBottom="24px">
              Please follow the steps to activate your sistering account. We
              look forward to working with you.
            </Text>
            <Button color="#7000DE" width="100%">
              <Text color="#fff">Continue</Text>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box backgroundColor="#f4f4f4" flexGrow={6}>
        {" "}
      </Box>
    </Box>
  );
};

export default CreateAccountPage;

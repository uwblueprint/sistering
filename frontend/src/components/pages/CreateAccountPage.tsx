import React from "react";
import { Text, Button, Box, Image } from "@chakra-ui/react";
import Sistering_Logo from "../../assets/Sistering_Logo.svg";

const CreateAccountPage = (): React.ReactElement => {
  const onContinue = () => {
    //
  };

  return (
    <Box width="100%" display="flex" flexDirection="row" height="100vh">
      <Box backgroundColor="background.white" flexGrow={4}>
        <Box maxWidth="480px" mt="8vh" mx="auto">
          <Image src={Sistering_Logo} alt="Sistering logo" h={32} />
          <Box mx="43px" mb="36px">
            <Text textStyle="display-large" marginBottom="12px">
              Welcome to Sistering!
            </Text>
            <Text marginBottom="24px" textStyle="body-regular">
              Please follow the steps to activate your sistering account. We
              look forward to working with you.
            </Text>
            <Button color="violet" width="100%">
              <Text color="background.white">Continue</Text>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box backgroundColor="background.light" flexGrow={6} />
    </Box>
  );
};

export default CreateAccountPage;

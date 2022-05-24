import React, { useState, useEffect } from "react";
import { Text, Box, Flex, Avatar, Button } from "@chakra-ui/react";

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  useEffect(() => {
    setProfilePhoto(
      "https://www.thesprucepets.com/thmb/q09WCbmIY_apTHaqAUFTd0TrhYI=/1936x1452/smart/filters:no_upscale()/fiddler-crab-134252510-57ffec745f9b5805c2b0f356.jpg",
    );
  }, []);
  return (
    <Box align="left">
      <Text mb={2} textStyle="display-large">
        Account Creation
      </Text>
      <Text>Profile Photo</Text>
      <Flex alignItems="center">
        <Avatar src={profilePhoto} m={3} size="lg" />
        <Button m={3} variant="outline">
          Upload Photo
        </Button>
        <Button m={3} variant="outline">
          Remove Photo
        </Button>
      </Flex>
    </Box>
  );
};

export default NewAccountPage;

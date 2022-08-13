import React, { useEffect } from "react";
import { Text, Box, Flex, Avatar, Button } from "@chakra-ui/react";


const ProfilePhotoForm = (): React.ReactElement => {

  return (
    <Box ml={4}>
      <Flex alignItems="center">
        <Avatar m={3} size="lg" />
      </Flex>
    </Box>
  );
};

export default ProfilePhotoForm;

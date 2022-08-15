import React from "react";
import { Box, Flex, Avatar } from "@chakra-ui/react";

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

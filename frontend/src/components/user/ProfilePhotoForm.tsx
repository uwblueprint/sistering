import React, { useEffect } from "react";
import { Text, Box, Flex, Avatar, Button } from "@chakra-ui/react";

type ProfilePhotoFormProps = {
  profilePhoto: string;
  setProfilePhoto: (profilePhoto: string) => void;
};

const ProfilePhotoForm = ({
  profilePhoto,
  setProfilePhoto,
}: ProfilePhotoFormProps): React.ReactElement => {
  useEffect(() => {
    setProfilePhoto("");
  });

  return (
    <Box ml={4}>
      <Text>Profile Photo</Text>
      <Flex alignItems="center">
        <Avatar src={profilePhoto} m={3} size="lg" />
        <Button m={3} variant="outline">
          Upload Photo
        </Button>
      </Flex>
    </Box>
  );
};

export default ProfilePhotoForm;

import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  return (
    <Box align="left">
      <Text mb={2} textStyle="display-large">
        Account Creation
      </Text>
      <ProfilePhotoForm
        profilePhoto={profilePhoto}
        setProfilePhoto={setProfilePhoto}
      />
    </Box>
  );
};

export default NewAccountPage;

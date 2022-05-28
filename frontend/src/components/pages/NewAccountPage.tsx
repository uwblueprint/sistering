import { Box, Container, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import SignupNavbar from "../common/SignupNavbar";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  return (
    <>
      <SignupNavbar />
      <Container maxW="container.xl" align="left">
        <Text mb={2} textStyle="display-large">
          Account Creation
        </Text>
        <ProfilePhotoForm
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
        />
      </Container>
    </>
  );
};

export default NewAccountPage;

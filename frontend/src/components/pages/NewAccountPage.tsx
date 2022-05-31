import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [isAdmin] = useState<boolean>(false);
  return (
    <>
      <SignupNavbar />
      <Container maxW="container.xl" align="left" mt={12}>
        <Text mb={2} textStyle="display-large">
          Account Creation
        </Text>
        <ProfilePhotoForm
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
        />
        <Divider my={8} />
        <AccountForm isAdmin={isAdmin} />
      </Container>
    </>
  );
};

export default NewAccountPage;

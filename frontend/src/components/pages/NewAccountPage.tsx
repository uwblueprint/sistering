import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

const CREATE_VOLUNTEER_USER = gql`
  mutation {
    createVolunteerUser(
      volunteerUser: {
        firstName: "Alice"
        lastName: "Zoo"
        email: "alice.zoo@gmail.com"
        password: "Password1"
        phoneNumber: "5195468902"
        dateOfBirth: "2003-10-12"
        hireDate: "2022-10-12"
        skills: []
        branches: []
      }
    ) {
      id
    }
  }
`;

const CREATE_EMPLOYEE_USER = gql`
  mutation {
    createEmployeeUser(
      employeeUser: {
        firstName: "Rickson"
        lastName: "Cedric"
        email: "rick8338@gmail.com"
        phoneNumber: "5195468902"
        password: "Password1"
        branchId: 3
        title: "CEO"
      }
    ) {
      id
    }
  }
`;

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [isAdmin] = useState<boolean>(false);
  const [clickToCreateEmployee] = useMutation(CREATE_EMPLOYEE_USER);
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
        <AccountForm isAdmin={isAdmin} profilePhoto={profilePhoto} />
      </Container>
    </>
  );
};

export default NewAccountPage;

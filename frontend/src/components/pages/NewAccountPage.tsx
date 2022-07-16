import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm, { AccountFormMode } from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";
import Loading from "../common/Loading";
import ErrorModal from "../common/ErrorModal";
import {
  CreateEmployeeUserDTO,
  CreateVolunteerUserDTO,
} from "../../types/api/UserType";

<<<<<<< HEAD
const CREATE_EMPLOYEE_USER = gql`
  mutation CreateEmployeeUser($employee: CreateEmployeeUserDTO!) {
    createEmployeeUser(employeeUser: $employee) {
=======
// inject uuid into these gql stuff here:
const CREATE_VOLUNTEER_USER = gql`
  mutation CreateVolunteerUser($volunteer: CreateVolunteerUserDTO!) {
    createVolunteerUser(volunteerUser: $volunteer) {
>>>>>>> cc42d23 (initial implementation of task (grabbed token from query, implemented into form variables, went through flow for createEmployee and createVolunteer resolvers - including deletion of user invite rows if mutations of creating user does not return err)
      id
    }
  }
`;

const CREATE_VOLUNTEER_USER = gql`
  mutation CreateVolunteerUser($volunteer: CreateVolunteerUserDTO!) {
    createVolunteerUser(volunteerUser: $volunteer) {
      id
    }
  }
`;

const DELETE_USER_INVITE = gql`
  mutation DeleteUserInvite($email: String!) {
    deleteUserInvite(email: $email) {
      uuid
    }
  }
`;

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [isAdmin] = useState<boolean>(false);
  const [
    createEmployee,
    { loading: createEmployeeLoading, error: createEmployeeError },
  ] = useMutation(CREATE_EMPLOYEE_USER);
  const [
    createVolunteer,
    { loading: createVolunteerLoading, error: createVolunteerError },
  ] = useMutation(CREATE_VOLUNTEER_USER);

  const [deleteUserInvite, { error: deleteUserInviteError }] = useMutation(
    DELETE_USER_INVITE,
  );

  if (createEmployeeLoading || createVolunteerLoading) {
    return <Loading />;
  }
  const isError = createEmployeeError || createVolunteerError;

<<<<<<< HEAD
  const onEmployeeCreate = async (employee: CreateEmployeeUserDTO) => {
    await createEmployee({
=======
  const onEmployeeCreate = async (employee: CreateEmployeeDTO) => {
    const response = await createEmployee({
>>>>>>> cc42d23 (initial implementation of task (grabbed token from query, implemented into form variables, went through flow for createEmployee and createVolunteer resolvers - including deletion of user invite rows if mutations of creating user does not return err)
      variables: {
        employee,
      },
    });

    if (!createEmployeeError) {
      await deleteUserInvite({
        variables: {
          email: response.email,
        },
      });
    }

    if (!deleteUserInviteError) {
      console.log("SUCCESS!");
    }
  };

<<<<<<< HEAD
  const onVolunteerCreate = async (volunteer: CreateVolunteerUserDTO) => {
    await createVolunteer({
=======
  const onVolunteerCreate = async (volunteer: CreateVolunteerDTO) => {
    const response = await createVolunteer({
>>>>>>> cc42d23 (initial implementation of task (grabbed token from query, implemented into form variables, went through flow for createEmployee and createVolunteer resolvers - including deletion of user invite rows if mutations of creating user does not return err)
      variables: {
        volunteer,
      },
    });

    if (!createVolunteerError) {
      await deleteUserInvite({
        variables: {
          email: response.email,
        },
      });
    }

    if (!deleteUserInviteError) {
      console.log("SUCCESS!");
    }
  };

  return (
    <>
      <SignupNavbar />
      {isError && <ErrorModal />}
      <Container maxW="container.xl" align="left" mt={12}>
        <Text mb={2} textStyle="display-large">
          Account Creation
        </Text>
        <ProfilePhotoForm
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
        />
        <Divider my={8} />
        <AccountForm
          mode={AccountFormMode.CREATE}
          isAdmin={isAdmin}
          email="testemail123@domain.com" // TODO: Replace with firebase email
          profilePhoto={profilePhoto}
          onEmployeeCreate={onEmployeeCreate}
          onVolunteerCreate={onVolunteerCreate}
        />
      </Container>
    </>
  );
};

export default NewAccountPage;

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

const CREATE_EMPLOYEE_USER = gql`
  mutation CreateEmployeeUser($employee: CreateEmployeeUserDTO!) {
    createEmployeeUser(employeeUser: $employee) {
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

  if (createEmployeeLoading || createVolunteerLoading) {
    return <Loading />;
  }
  const isError = createEmployeeError || createVolunteerError;

  const onEmployeeCreate = async (employee: CreateEmployeeUserDTO) => {
    await createEmployee({
      variables: {
        employee,
      },
    });
  };

  const onVolunteerCreate = async (volunteer: CreateVolunteerUserDTO) => {
    await createVolunteer({
      variables: {
        volunteer,
      },
    });
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
          email="testemail123@domain.com"
          profilePhoto={profilePhoto}
          onEmployeeCreate={onEmployeeCreate}
          onVolunteerCreate={onVolunteerCreate}
        />
      </Container>
    </>
  );
};

export default NewAccountPage;

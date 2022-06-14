import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";
import Loading from "../common/Loading";
import ErrorModal from "../common/ErrorModal";

const CREATE_VOLUNTEER_USER = gql`
  mutation CreateVolunteerUser($volunteer: CreateVolunteerUserDTO!) {
    createVolunteerUser(volunteerUser: $volunteer) {
      id
    }
  }
`;

const CREATE_EMPLOYEE_USER = gql`
  mutation CreateEmployeeUser($employee: CreateEmployeeUserDTO!) {
    createEmployeeUser(employeeUser: $employee) {
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

  const onEmployeeCreate = async (employee: any) => {
    try {
      await createEmployee({
        variables: {
          employee,
        },
      });
    } catch (e) {
      /* eslint-disable-next-line no-alert */
      alert("Error: Issue with creating employee user");
      // TODO: Render error modal instead
    }
  };

  const onVolunteerCreate = async (volunteer: any) => {
    try {
      await createVolunteer({
        variables: {
          volunteer,
        },
      });
    } catch (e) {
      // TODO: Render error modal instead
      alert("Error: Issue with creating volunteer user");
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
          isAdmin={isAdmin}
          profilePhoto={profilePhoto}
          onEmployeeCreate={onEmployeeCreate}
          onVolunteerCreate={onVolunteerCreate}
        />
      </Container>
    </>
  );
};

export default NewAccountPage;

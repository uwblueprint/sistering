import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";
import Loading from "../common/Loading";
import ErrorModal from "../common/ErrorModal";
import { EmployeeUserDTO } from "../../types/api/EmployeeTypes";
import { VolunteerDTO } from "../../types/api/UserType";

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

  const onEmployeeCreate = async (employee: EmployeeUserDTO) => {
    await createEmployee({
      variables: {
        employee,
      },
    });
  };

  const onVolunteerCreate = async (volunteer: VolunteerDTO) => {
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

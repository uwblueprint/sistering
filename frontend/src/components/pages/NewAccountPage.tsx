import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm, { AccountFormMode } from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";
import Loading from "../common/Loading";
import ErrorModal from "../common/ErrorModal";
import {
  CreateEmployeeUserDTO,
  CreateVolunteerUserDTO,
  UserInviteResponseDTO,
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

const DELETE_USER_INVITE = gql`
  mutation DeleteUserInvite($email: String!) {
    deleteUserInvite(email: $email) {
      uuid
    }
  }
`;

const GET_USER_INVITE = gql`
  query GetUserInvite($uuid: String!) {
    getUserInvite(uuid: $uuid) {
      uuid
      email
      role
    }
  }
`;

type GetUserInviteResponse = {
  getUserInvite: UserInviteResponseDTO;
};

const NewAccountPage = (): React.ReactElement => {
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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

  const [userInvite, setUserInvite] = useState<UserInviteResponseDTO>();

  const history = useHistory();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  useQuery<GetUserInviteResponse>(GET_USER_INVITE, {
    fetchPolicy: "cache-and-network",
    variables: {
      uuid: token,
    },
    onCompleted: (data) => {
      setUserInvite(data.getUserInvite);
      if (userInvite?.role === "EMPLOYEE") {
        setIsAdmin(true);
      }
    },
  });

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

    if (!createEmployeeError) {
      await deleteUserInvite({
        variables: {
          email: userInvite?.email,
        },
      });
    }

    history.push("/account-created");
  };

  const onVolunteerCreate = async (volunteer: CreateVolunteerUserDTO) => {
    await createVolunteer({
      variables: {
        volunteer,
      },
    });

    if (!createVolunteerError) {
      await deleteUserInvite({
        variables: {
          email: userInvite?.email,
        },
      });
    }

    history.push("/account-created");
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
          email={userInvite?.email} // TODO: Replace with firebase email
          profilePhoto={profilePhoto}
          onEmployeeCreate={onEmployeeCreate}
          onVolunteerCreate={onVolunteerCreate}
        />
      </Container>
    </>
  );
};

export default NewAccountPage;

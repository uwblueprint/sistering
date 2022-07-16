import { gql, useMutation, useQuery } from "@apollo/client";
import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import {
  UpdateEmployeeUserDTO,
  UpdateVolunteerUserDTO,
  EmployeeUserResponseDTO,
  VolunteerUserResponseDTO,
} from "../../types/api/UserType";
import ErrorModal from "../common/ErrorModal";
import Loading from "../common/Loading";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm, { AccountFormMode } from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const VOLUNTEER_BY_ID = gql`
  query VolunteerUserById($id: ID!) {
    volunteerUserById(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
      emergencyContactPhone
      hireDate
      dateOfBirth
      skills {
        id
        name
      }
      languages
      branches {
        id
        name
      }
    }
  }
`;

const EMPLOYEE_BY_ID = gql`
  query EmployeeUserById($id: ID!) {
    employeeUserById(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
      emergencyContactPhone
      languages
      branches {
        id
        name
      }
    }
  }
`;

const UPDATE_EMPLOYEE_USER = gql`
  mutation UpdateEmployeeUser($id: ID!, $employee: UpdateEmployeeUserDTO!) {
    updateEmployeeUserById(id: $id, employeeUser: $employee) {
      id
    }
  }
`;

const UPDATE_VOLUNTEER_USER = gql`
  mutation UpdateVolunteerUser($id: ID!, $volunteer: UpdateVolunteerUserDTO!) {
    updateVolunteerUserById(id: $id, volunteerUser: $volunteer) {
      id
    }
  }
`;
const EditAccountPage = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  const [user, setUser] = useState<
    (EmployeeUserResponseDTO & VolunteerUserResponseDTO) | null
  >(null);
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  useQuery(
    authenticatedUser?.role !== Role.Volunteer
      ? EMPLOYEE_BY_ID
      : VOLUNTEER_BY_ID,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        id: authenticatedUser?.id,
      },
      onCompleted: (data) => {
        setUser(data.employeeUserById || data.volunteerUserById);
      },
    },
  );

  const [
    editEmployee,
    { loading: editEmployeeLoading, error: editEmployeeError },
  ] = useMutation(UPDATE_EMPLOYEE_USER);
  const [
    editVolunteer,
    { loading: editVolunteerLoading, error: editVolunteerError },
  ] = useMutation(UPDATE_VOLUNTEER_USER);

  if (editEmployeeLoading || editVolunteerLoading) {
    return <Loading />;
  }
  const isError = editEmployeeError || editVolunteerError;

  const onEmployeeEdit = async (employee: UpdateEmployeeUserDTO) => {
    await editEmployee({
      variables: {
        id: user?.id,
        employee,
      },
    });
  };

  const onVolunteerEdit = async (volunteer: UpdateVolunteerUserDTO) => {
    await editVolunteer({
      variables: {
        id: user?.id,
        volunteer: {
          ...volunteer,
          hireDate: user?.hireDate,
        },
      },
    });
  };

  console.log(user);

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
        {user && (
          <AccountForm
            mode={AccountFormMode.EDIT}
            isAdmin={authenticatedUser?.role !== Role.Volunteer}
            profilePhoto={profilePhoto}
            firstName={user?.firstName}
            lastName={user?.lastName}
            email={user?.email}
            phoneNumber={user?.phoneNumber}
            emergencyNumber={user?.emergencyContactPhone}
            prevLanguages={user?.languages?.map((language, i) => ({
              id: i.toString(),
              name: language,
            }))}
            onEmployeeEdit={onEmployeeEdit}
            onVolunteerEdit={onVolunteerEdit}
          />
        )}
      </Container>
    </>
  );
};

export default EditAccountPage;

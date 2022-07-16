import { gql, useMutation, useQuery } from "@apollo/client";
import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import {
  EditEmployeeDTO,
  EditVolunteerDTO,
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

const EDIT_EMPLOYEE_USER = gql`
  mutation CreateEmployeeUser($employee: CreateEmployeeUserDTO!) {
    updateEmployeeUserById(employeeUser: $employee) {
      id
    }
  }
`;

const EDIT_VOLUNTEER_USER = gql`
  mutation CreateVolunteerUser($volunteer: CreateVolunteerUserDTO!) {
    updateVolunteerUserById(volunteerUser: $volunteer) {
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
        setUser(data.employeeUserById);
      },
    },
  );

  const [
    editEmployee,
    { loading: editEmployeeLoading, error: editEmployeeError },
  ] = useMutation(EDIT_EMPLOYEE_USER);
  const [
    editVolunteer,
    { loading: editVolunteerLoading, error: editVolunteerError },
  ] = useMutation(EDIT_VOLUNTEER_USER);

  if (editEmployeeLoading || editVolunteerLoading) {
    return <Loading />;
  }
  const isError = editEmployeeError || editVolunteerError;

  const onEmployeeEdit = async (employee: EditEmployeeDTO) => {
    await editEmployee({
      variables: {
        employee,
      },
    });
  };

  const onVolunteerEdit = async (volunteer: EditVolunteerDTO) => {
    await editVolunteer({
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
        {user && (
          <AccountForm
            mode={AccountFormMode.EDIT}
            isAdmin
            profilePhoto={profilePhoto}
            firstName={user?.firstName}
            lastName={user?.lastName}
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

import { gql, useMutation, useQuery } from "@apollo/client";
import { Container, Divider, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import moment from "moment";
import {
  UpdateEmployeeUserDTO,
  UpdateVolunteerUserDTO,
  EmployeeUserResponseDTO,
  VolunteerUserResponseDTO,
  LANGUAGES,
} from "../../types/api/UserType";
import ErrorModal from "../common/ErrorModal";
import Loading from "../common/Loading";
import SignupNavbar from "../common/SignupNavbar";
import AccountForm, { AccountFormMode } from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

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

const VOLUNTEER_BY_ID = gql`
  query VolunteerUserById($id: ID!) {
    volunteerUserById(id: $id) {
      id
      firstName
      lastName
      email
      dateOfBirth
      pronouns
      phoneNumber
      emergencyContactPhone
      hireDate
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

  const [key, setKey] = useState<number>(0); // Used to force a re-render
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
        setKey(key + 1);
      },
    },
  );

  const [
    editEmployee,
    { loading: editEmployeeLoading, error: editEmployeeError },
  ] = useMutation(UPDATE_EMPLOYEE_USER, {
    refetchQueries: () => [
      {
        query: EMPLOYEE_BY_ID,
        variables: {
          id: authenticatedUser?.id,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [
    editVolunteer,
    { loading: editVolunteerLoading, error: editVolunteerError },
  ] = useMutation(UPDATE_VOLUNTEER_USER, {
    refetchQueries: () => [
      {
        query: VOLUNTEER_BY_ID,
        variables: {
          id: authenticatedUser?.id,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

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
            key={key}
            mode={AccountFormMode.EDIT}
            isAdmin={authenticatedUser?.role !== Role.Volunteer}
            profilePhoto={profilePhoto}
            firstName={user?.firstName}
            lastName={user?.lastName}
            email={user?.email}
            dateOfBirth={moment(user?.dateOfBirth).format("YYYY-MM-DD")}
            pronouns={user?.pronouns}
            phoneNumber={user?.phoneNumber}
            emergencyNumber={user?.emergencyContactPhone}
            prevLanguages={user?.languages?.map((language) => ({
              id: String(LANGUAGES.indexOf(language) + 1),
              name: language,
            }))}
            prevSkills={user?.skills}
            onEmployeeEdit={onEmployeeEdit}
            onVolunteerEdit={onVolunteerEdit}
          />
        )}
      </Container>
    </>
  );
};

export default EditAccountPage;

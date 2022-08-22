import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Container,
  Divider,
  HStack,
  Tag,
  TagLabel,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import moment from "moment";
import {
  UpdateEmployeeUserDTO,
  UpdateVolunteerUserDTO,
  EmployeeUserResponseDTO,
  VolunteerUserResponseDTO,
} from "../../types/api/UserType";
import Loading from "../common/Loading";
import AccountForm, { AccountFormMode } from "../user/AccountForm";
import ProfilePhotoForm from "../user/ProfilePhotoForm";

import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import Navbar from "../common/Navbar";
import {
  AdminNavbarTabs,
  AdminPages,
  EmployeeNavbarTabs,
  VolunteerNavbarTabs,
} from "../../constants/Tabs";

const EMPLOYEE_BY_ID = gql`
  query EmployeeUserById($id: ID!) {
    employeeUserById(id: $id) {
      id
      firstName
      lastName
      email
      dateOfBirth
      pronouns
      phoneNumber
      emergencyContactPhone
      emergencyContactEmail
      emergencyContactName
      languages {
        id
        name
      }
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
      emergencyContactEmail
      emergencyContactName
      hireDate
      skills {
        id
        name
      }
      languages {
        id
        name
      }
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
  const [userRole] = useState(authenticatedUser?.role);

  const [key, setKey] = useState<number>(0); // Used to force a re-render
  const [user, setUser] = useState<
    (EmployeeUserResponseDTO & VolunteerUserResponseDTO) | null
  >(null);
  const toast = useToast();

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

  const [editEmployee, { loading: editEmployeeLoading }] = useMutation(
    UPDATE_EMPLOYEE_USER,
    {
      refetchQueries: () => [
        {
          query: EMPLOYEE_BY_ID,
          variables: {
            id: authenticatedUser?.id,
          },
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const [editVolunteer, { loading: editVolunteerLoading }] = useMutation(
    UPDATE_VOLUNTEER_USER,
    {
      refetchQueries: () => [
        {
          query: VOLUNTEER_BY_ID,
          variables: {
            id: authenticatedUser?.id,
          },
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  if (editEmployeeLoading || editVolunteerLoading) {
    return <Loading />;
  }

  const onEmployeeEdit = async (employee: UpdateEmployeeUserDTO) => {
    try {
      await editEmployee({
        variables: {
          id: user?.id,
          employee,
        },
      });
    } catch (error: unknown) {
      toast({
        title: "Cannot edit employee",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const onVolunteerEdit = async (volunteer: UpdateVolunteerUserDTO) => {
    try {
      await editVolunteer({
        variables: {
          id: user?.id,
          volunteer: {
            ...volunteer,
            hireDate: user?.hireDate,
          },
        },
      });
    } catch (error: unknown) {
      toast({
        title: "Cannot edit volunteer",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={
          // eslint-disable-next-line no-nested-ternary
          userRole === Role.Admin
            ? AdminNavbarTabs
            : userRole === Role.Employee
            ? EmployeeNavbarTabs
            : VolunteerNavbarTabs
        }
      />
      <Container maxW="container.xl" alignItems="left" mt={12}>
        <Text mb={2} textStyle="display-large">
          Edit Profile
        </Text>
        <ProfilePhotoForm />
        {user && (
          <HStack mt={6}>
            {user.branches.map((branch) => (
              <Tag
                key={branch.id}
                size="lg"
                borderRadius="full"
                variant="brand"
              >
                <TagLabel>{branch.name}</TagLabel>
              </Tag>
            ))}
          </HStack>
        )}
        <Divider my={6} />
        {user && (
          <AccountForm
            key={key}
            mode={AccountFormMode.EDIT}
            isAdmin={authenticatedUser?.role !== Role.Volunteer}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
            dateOfBirth={
              user.dateOfBirth
                ? moment(user.dateOfBirth).format("YYYY-MM-DD")
                : ""
            }
            pronouns={user.pronouns}
            phoneNumber={user.phoneNumber}
            emergencyNumber={user.emergencyContactPhone}
            emergencyEmail={user.emergencyContactEmail}
            emergencyName={user.emergencyContactName}
            prevLanguages={user.languages}
            prevSkills={user.skills}
            onEmployeeEdit={onEmployeeEdit}
            onVolunteerEdit={onVolunteerEdit}
          />
        )}
      </Container>
    </>
  );
};

export default EditAccountPage;

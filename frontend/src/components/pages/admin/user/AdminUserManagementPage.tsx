import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { VolunteerUserResponseDTO } from "../../../../types/api/UserType";
import { EmployeeUserResponseDTO } from "../../../../types/api/EmployeeTypes";
import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";

const USERS = gql`
  query AdminUserManagementPage_Users {
    employeeUsers {
      title
      firstName
      lastName
      email
      phoneNumber
      branchId
    }
    volunteerUsers {
      firstName
      lastName
      email
      phoneNumber
      pronouns
      skills {
        id
        name
      }
      branches {
        id
        nam
      }
    }
  }
`;

const AdminUserManagementPage = (): React.ReactElement => {
  const [allVolunteers, setAllVolunteers] = useState<
    VolunteerUserResponseDTO[] | null
  >(null);

  const [allEmployees, setAllEmployees] = useState<
    EmployeeUserResponseDTO[] | null
  >(null);

  const { loading, error } = useQuery(USERS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllVolunteers(data.employeeUsers);
      setAllEmployees(data.volunteerUsers);
    },
  });

  return (
    <Box>
      {loading && <Loading />}
      {error && <ErrorModal />}
    </Box>
  );
};

export default AdminUserManagementPage;

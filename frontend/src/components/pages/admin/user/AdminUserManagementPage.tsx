import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { VolunteerUserResponseDTO } from "../../../../types/api/UserType";
import { EmployeeUserResponseDTO } from "../../../../types/api/EmployeeTypes";
import ErrorModal from "../../../common/ErrorModal";

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
        name
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
  const { error } = useQuery(USERS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllVolunteers(data.postings.employeeUsers);
      setAllEmployees(data.postings.volunteerUsers);
    },
  });
  return <Box> {error && <ErrorModal />}</Box>;
};

// const AdminUserManagementPage = (): React.ReactElement => {
//   return <Box />;
// };
export default AdminUserManagementPage;

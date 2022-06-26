import React, { useState } from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { VolunteerUserResponseDTO } from "../../../../types/api/UserType";
import { EmployeeUserResponseDTO } from "../../../../types/api/EmployeeTypes";
import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";
import ProfileDrawer from "./ProfileDrawer";

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

  const [branches, setBranches] = useState([
    "branch1",
    "branch2",
    "branch3",
    "branch4",
    "branch5",
  ]);

  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { loading, error } = useQuery(USERS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllVolunteers(data.employeeUsers);
      setAllEmployees(data.volunteerUsers);
    },
  });

  const handleBranchMenuItemClicked = (item: string) => {
    if (selectedBranches.includes(item)) {
      setSelectedBranches(selectedBranches.filter((branch) => branch !== item));
    } else {
      setSelectedBranches([...selectedBranches, item]);
    }
  };

  return (
    <Box>
      <Button onClick={onOpen}>Open</Button>
      <ProfileDrawer
        isOpen={isOpen}
        branches={branches}
        selectedBranches={selectedBranches}
        onClose={onClose}
        handleBranchMenuItemClicked={handleBranchMenuItemClicked}
      />
      {loading && <Loading />}
      {error && <ErrorModal />}
    </Box>
  );
};

export default AdminUserManagementPage;

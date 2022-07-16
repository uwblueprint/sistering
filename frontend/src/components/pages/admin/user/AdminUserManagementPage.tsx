import React, { useState } from "react";
import { Flex, Box, Table, Tbody, useDisclosure } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";
import ProfileDrawer from "./ProfileDrawer";
import UserManagementTableRow from "../../../admin/users/UserManagementTableRow";
import Navbar from "../../../common/Navbar";
import AdminUserManagementPageHeader from "../../../admin/AdminUserManagementPageHeader";

import { VolunteerUserResponseDTO } from "../../../../types/api/UserType";
import { EmployeeUserResponseDTO } from "../../../../types/api/EmployeeTypes";
import {
  BranchQueryResponse,
  BranchResponseDTO,
} from "../../../../types/api/BranchTypes";
import { AdminNavbarTabs, AdminPages } from "../../../../constants/Tabs";

const USERS = gql`
  query AdminUserManagementPage_Users {
    employeeUsers {
      firstName
      lastName
      email
      phoneNumber
      branches {
        id
        name
      }
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

const BRANCHES = gql`
  query AdminUserManagementPage_Branches {
    branches {
      id
      name
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
  const [branches, setBranches] = useState<BranchResponseDTO[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<BranchResponseDTO[]>(
    [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { loading, error } = useQuery(USERS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllVolunteers(data.employeeUsers);
      setAllEmployees(data.volunteerUsers);
    },
  });

  const handleBranchMenuItemClicked = (clickedBranch: BranchResponseDTO) => {
    if (selectedBranches.includes(clickedBranch)) {
      setSelectedBranches(
        selectedBranches.filter((branch) => branch !== clickedBranch),
      );
    } else {
      setSelectedBranches([...selectedBranches, clickedBranch]);
    }
  };

  useQuery<BranchQueryResponse>(BRANCHES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setBranches(data.branches);
    },
  });

  // Temporary state for user management row checkboxes in testing #453.
  const [row1Checked, setRow1Checked] = useState(false);
  const [row2Checked, setRow2Checked] = useState(false);
  const [row3Checked, setRow3Checked] = useState(false);

  return (
    <>
      <ProfileDrawer
        isOpen={isOpen}
        branches={branches}
        selectedBranches={selectedBranches}
        onClose={onClose}
        handleBranchMenuItemClicked={handleBranchMenuItemClicked}
      />
      {loading && <Loading />}
      {error && <ErrorModal />}
      <Flex flexFlow="column" width="100%" height="100vh">
        <Navbar
          defaultIndex={Number(AdminPages.AdminUserManagement)}
          tabs={AdminNavbarTabs}
        />
        <AdminUserManagementPageHeader
          branches={branches}
          onOpenProfileDrawer={onOpen}
        />
        <Box
          flex={1}
          backgroundColor="background.light"
          width="100%"
          px="100px"
          pt="32px"
        >
          <Box m={20} border="1px" borderRadius="md" borderColor="gray.200">
            <Table variant="brand">
              <Tbody>
                <UserManagementTableRow
                  firstName="Amanda"
                  lastName="Du 1"
                  pronouns="She/Her"
                  email="atdu@uwblueprint.org"
                  phoneNumber="123-456-7890"
                  checked={row1Checked}
                  onCheck={() => setRow1Checked(!row1Checked)}
                />
                <UserManagementTableRow
                  firstName="Amanda"
                  lastName="Du 2"
                  pronouns="She/Her"
                  email="atdu@uwblueprint.org"
                  phoneNumber="123-456-7890"
                  checked={row2Checked}
                  onCheck={() => setRow2Checked(!row2Checked)}
                />
                <UserManagementTableRow
                  firstName="Amanda"
                  lastName="Du 3"
                  pronouns="She/Her"
                  email="atdu@uwblueprint.org"
                  phoneNumber="123-456-7890"
                  checked={row3Checked}
                  onCheck={() => setRow3Checked(!row3Checked)}
                />
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default AdminUserManagementPage;

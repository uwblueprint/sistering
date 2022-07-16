import React, { useState } from "react";
import { Box, Button, Table, Tbody, useDisclosure } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { VolunteerUserResponseDTO } from "../../../../types/api/UserType";
import { EmployeeUserResponseDTO } from "../../../../types/api/EmployeeTypes";
import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";
import ProfileDrawer from "./ProfileDrawer";
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";
import UserManagementTableRow from "../../../admin/users/UserManagementTableRow";

const USERS = gql`
  query AdminUserManagementPage_Users {
    employeeUsers {
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

  const [branches, setBranches] = useState<BranchResponseDTO[]>([
    { id: "1", name: "branch1" },
    { id: "2", name: "branch1" },
    { id: "3", name: "branch3" },
    { id: "4", name: "branch4" },
    { id: "5", name: "branch5" },
  ]);

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

  // Temporary state for user management row checkboxes in testing #453.
  const [row1Checked, setRow1Checked] = useState(false);
  const [row2Checked, setRow2Checked] = useState(false);
  const [row3Checked, setRow3Checked] = useState(false);

  return (
    <>
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

      {/* Temporary table for testing #453, please remove later. */}
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
    </>
  );
};

export default AdminUserManagementPage;

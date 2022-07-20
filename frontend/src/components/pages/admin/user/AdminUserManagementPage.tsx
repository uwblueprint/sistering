import React, { useState } from "react";
import {
  Flex,
  Box,
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useDisclosure,
  useToast,
  chakra,
} from "@chakra-ui/react";
import { useTable, useSortBy, Column } from "react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
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
      emergencyContactName
      emergencyContactPhone
      emergencyContactEmail
      branches {
        id
        name
      }
      languages
    }
    volunteerUsers {
      firstName
      lastName
      email
      phoneNumber
      pronouns
      emergencyContactName
      emergencyContactPhone
      emergencyContactEmail
      skills {
        id
        name
      }
      branches {
        id
        name
      }
      languages
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

  const [userManagementTableTab, setUserManagementTableTab] = useState<number>(
    0,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Temporary state for user management row checkboxes in testing #453.
  const [row1Checked, setRow1Checked] = useState(false);
  const [row2Checked, setRow2Checked] = useState(false);
  const [row3Checked, setRow3Checked] = useState(false);

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

  const data = React.useMemo(
    () => [
      {
        fromUnit: "inches",
        toUnit: "millimetres (mm)",
        factor: 25.4,
      },
      {
        fromUnit: "feet",
        toUnit: "centimetres (cm)",
        factor: 30.48,
      },
      {
        fromUnit: "yards",
        toUnit: "metres (m)",
        factor: 0.91444,
      },
    ],
    [],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "To convert",
        accessor: "fromUnit" as const,
      },
      {
        Header: "Into",
        accessor: "toUnit" as const,
      },
      {
        Header: "Multiply by",
        accessor: "factor" as const,
        isNumeric: true,
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

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
          <TableContainer border="1px" borderRadius="md" borderColor="gray.200">
            <Table variant="brand">
              <Thead>
                {headerGroups.map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        {...header.getHeaderProps(
                          header.getSortByToggleProps(),
                        )}
                      >
                        {header.render("Header")}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                <UserManagementTableRow
                  firstName="Amanda"
                  lastName="Du 1"
                  pronouns="She/Her"
                  email="atdu@uwblueprint.org"
                  phoneNumber="123-456-7890"
                  emergencyContactName="Stephanie Smith"
                  emergencyContactPhone="905-124-2313"
                  emergencyContactEmail="stephaniesmith@gmail.com"
                  totalHours="135"
                  languages={["English", "French"]}
                  skills={["Medical Terminology", "Faxing", "Microsoft Office"]}
                  isVolunteer
                  checked={row1Checked}
                  onCheck={() => setRow1Checked(!row1Checked)}
                  branches={branches}
                  selectedBranches={selectedBranches}
                  handleBranchMenuItemClicked={handleBranchMenuItemClicked}
                />
                <UserManagementTableRow
                  firstName="Amanda"
                  lastName="Du 2"
                  pronouns="She/Her"
                  email="atdu@uwblueprint.org"
                  phoneNumber="123-456-7890"
                  emergencyContactName="Stephanie Smith"
                  emergencyContactPhone="905-124-2313"
                  emergencyContactEmail="stephaniesmith@gmail.com"
                  totalHours="135"
                  languages={["English", "French"]}
                  skills={["Medical Terminology", "Faxing", "Microsoft Office"]}
                  isVolunteer
                  checked={row2Checked}
                  onCheck={() => setRow2Checked(!row2Checked)}
                  branches={branches}
                  selectedBranches={selectedBranches}
                  handleBranchMenuItemClicked={handleBranchMenuItemClicked}
                />
                <UserManagementTableRow
                  firstName="Amanda"
                  lastName="Du 3"
                  pronouns="She/Her"
                  email="atdu@uwblueprint.org"
                  phoneNumber="123-456-7890"
                  emergencyContactName="Stephanie Smith"
                  emergencyContactPhone="905-124-2313"
                  emergencyContactEmail="stephaniesmith@gmail.com"
                  languages={["English", "French"]}
                  checked={row3Checked}
                  onCheck={() => setRow3Checked(!row3Checked)}
                  branches={branches}
                  selectedBranches={selectedBranches}
                  handleBranchMenuItemClicked={handleBranchMenuItemClicked}
                  isVolunteer={false}
                />
              </Tbody>
            </Table>
          </TableContainer>
          <Button
            onClick={() =>
              toast({
                title: "User Branches Updated",
                description: "7 user(s) added to new branch(es).",
                status: "success",
                duration: 5000,
                isClosable: true,
              })
            }
          >
            Add Users to Branch
          </Button>
        </Box>
      </Flex>
    </>
  );
};

export default AdminUserManagementPage;

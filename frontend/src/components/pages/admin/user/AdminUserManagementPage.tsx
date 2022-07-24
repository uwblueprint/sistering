/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLProps, useState } from "react";
import {
  Flex,
  Box,
  Button,
  Checkbox,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
  chakra,
  CheckboxProps,
} from "@chakra-ui/react";
import { useTable, useSortBy, Column } from "react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { gql, useQuery } from "@apollo/client";

import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";
import ProfileDrawer from "./ProfileDrawer";
import UserManagementTableRow from "../../../admin/users/UserManagementTableRow";
import Navbar from "../../../common/Navbar";
import AdminUserManagementPageHeader, {
  AdminUserManagementTableTab,
} from "../../../admin/AdminUserManagementPageHeader";

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

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & CheckboxProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Checkbox ref={ref} {...rest} />;
}

const AdminUserManagementPage = (): React.ReactElement => {
  const [allVolunteers, setAllVolunteers] = useState<
    VolunteerUserResponseDTO[]
  >([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeUserResponseDTO[]>(
    [],
  );

  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [branches, setBranches] = useState<BranchResponseDTO[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<BranchResponseDTO[]>(
    [],
  );

  const [
    userManagementTableTab,
    setUserManagementTableTab,
  ] = useState<AdminUserManagementTableTab>(
    AdminUserManagementTableTab.Volunteers,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const handleTabClicked = (tab: AdminUserManagementTableTab) => {
    setUserManagementTableTab(tab);
  };

  useQuery<BranchQueryResponse>(BRANCHES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setBranches(data.branches);
    },
  });

  const data = React.useMemo(
    () =>
      userManagementTableTab === AdminUserManagementTableTab.Volunteers
        ? allVolunteers.map((volunteer) => ({
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            pronouns: volunteer.pronouns,
            email: volunteer.email,
            phoneNumber: volunteer.phoneNumber,
          }))
        : allEmployees.map((employee) => ({
            firstName: employee.firstName,
            lastName: employee.lastName,
            pronouns: "",
            email: employee.email,
            phoneNumber: employee.phoneNumber,
          })),
    [allEmployees, allVolunteers, userManagementTableTab],
  );

  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        Cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Pronouns",
        accessor: "pronouns",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
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
  } = useTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

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
          handleTabClicked={handleTabClicked}
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
                    <Checkbox
                      position="absolute"
                      top={0}
                      bottom={0}
                      onChange={() => console.log("checked")}
                    />
                    {headerGroup.headers.map((header) => (
                      // eslint-disable-next-line react/jsx-key
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
              <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Tr {...row.getRowProps()}>
                      <Checkbox
                        position="absolute"
                        top={0}
                        bottom={0}
                        onChange={() => console.log("checked")}
                      />
                      {row.cells.map((cell) => (
                        // eslint-disable-next-line react/jsx-key
                        <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                      ))}
                    </Tr>
                  );
                })}
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

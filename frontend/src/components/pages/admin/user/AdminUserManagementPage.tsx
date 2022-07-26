import React, { useState } from "react";
import {
  Flex,
  Box,
  Button,
  Checkbox,
  TableContainer,
  Table as ChakraTable,
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
import {
  useTable,
  useSortBy,
  TableCellProps,
  TableHeaderProps,
} from "react-table";
import { gql, useQuery } from "@apollo/client";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
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

export type User = {
  firstName: string;
  lastName: string;
  pronouns: string;
  email: string;
  phoneNumber: string;
  subRows?: User[];
};

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

  const data = React.useMemo<User[]>(
    () =>
      userManagementTableTab === AdminUserManagementTableTab.Volunteers
        ? allVolunteers.map((volunteer) => ({
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            pronouns: volunteer.pronouns ?? "N/A",
            email: volunteer.email,
            phoneNumber: volunteer.phoneNumber ?? "N/A",
          }))
        : allEmployees.map((employee) => ({
            firstName: employee.firstName,
            lastName: employee.lastName,
            pronouns: "N/A", // TODO: Update once pronouns are migrated
            email: employee.email,
            phoneNumber: employee.phoneNumber ?? "N/A",
          })),
    [allEmployees, allVolunteers, userManagementTableTab],
  );

  // TODO: Figure out proper tying
  const columns = React.useMemo<ColumnDef<User>[]>(
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
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        header: "First Name",
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: "Pronouns",
        accessorKey: "pronouns",
        footer: (props) => props.column.id,
      },
      {
        header: "Email",
        accessorKey: "email",
        footer: (props) => props.column.id,
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = useReactTable({
  //   data,
  //   columns,
  //   state: {
  //     rowSelection,
  //   },
  //   onRowSelectionChange: setRowSelection,
  // });

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
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
            <ChakraTable variant="brand">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    <Checkbox
                      position="absolute"
                      top={0}
                      bottom={0}
                      onChange={() => console.log("checked")}
                    />
                    {headerGroup.headers.map((header) => (
                      <Th
                        // {...header.getHeaderProps(
                        //   header.getSortByToggleProps(),
                        // )}
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {/* {header.render("Header")} */}
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Tr key={row.id}>
                      {/* {row.cells.map((cell) => (
                        // eslint-disable-next-line react/jsx-key
                        <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                      ))} */}
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </ChakraTable>
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

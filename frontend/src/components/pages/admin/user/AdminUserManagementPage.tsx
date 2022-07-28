/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { HTMLProps, useState } from "react";
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
  CheckboxProps,
  chakra,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import {
  CellContext,
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  HeaderContext,
  Table,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useSortBy } from "react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
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
};

const sortIcon: { [index: string]: JSX.Element } = {
  asc: <TriangleUpIcon aria-label="sorted ascending" />,
  desc: <TriangleDownIcon aria-label="sorted descending" />,
};

const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: {
  indeterminate?: boolean;
} & HTMLProps<HTMLInputElement>): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} cursor-pointer`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
};

const AdminUserManagementPage = (): React.ReactElement => {
  const [allVolunteers, setAllVolunteers] = useState<
    VolunteerUserResponseDTO[]
  >([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeUserResponseDTO[]>(
    [],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
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
        header: ({ table }: HeaderContext<User, unknown>) => (
          <IndeterminateCheckbox
            // checked={table.getIsAllRowsSelected()}
            // indeterminate={table.getIsSomeRowsSelected()}
            // onChange={table.getToggleAllRowsSelectedHandler()}
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }: CellContext<User, unknown>) => (
          <IndeterminateCheckbox
            // checked={row.getIsSelected()}
            // indeterminate={row.getIsSomeSelected()}
            // onChange={row.getToggleSelectedHandler()}
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        header: () => "First Name",
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: () => "Last Name",
        accessorKey: "lastName",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: () => "Pronouns",
        accessorKey: "pronouns",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: () => "Email",
        accessorKey: "email",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: () => "Phone Number",
        accessorKey: "phoneNumber",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  console.log(rowSelection);

  // TODO: Add pagination footer
  // TODO: make select all work
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
        {/* // TODO: Add global filter */}
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
          <TableContainer
            border="1px"
            borderRadius="md"
            borderColor="gray.200"
            bgColor="white"
          >
            <ChakraTable variant="brand">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <Box
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }
                            _hover={{
                              cursor: "pointer",
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <chakra.span pl="4">
                              {sortIcon[
                                header.column.getIsSorted() as string
                              ] ?? null}
                            </chakra.span>
                          </Box>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Tr
                      key={row.id}
                      bgColor={row.getIsSelected() ? "purple.50" : undefined}
                    >
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

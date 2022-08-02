/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { HTMLProps, useState } from "react";
import {
  Flex,
  Box,
  TableContainer,
  Table as ChakraTable,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  chakra,
  TableCaption,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  HeaderContext,
  useReactTable,
  getSortedRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";
import Navbar from "../../../common/Navbar";
import AdminUserManagementPageHeader, {
  AdminUserManagementTableTab,
} from "../../../admin/AdminUserManagementPageHeader";

import { VolunteerUserResponseDTO } from "../../../../types/api/UserType";
import { EmployeeUserResponseDTO } from "../../../../types/api/EmployeeTypes";
import {
  BranchDTO,
  BranchQueryResponse,
  BranchResponseDTO,
} from "../../../../types/api/BranchTypes";
import { AdminNavbarTabs, AdminPages } from "../../../../constants/Tabs";
import UserManagementTableProfileCell from "../../../admin/users/UserManagementTableProfileCell";
import getTitleCaseForOneWord from "../../../../utils/StringUtils";
import MultiUserBranchDrawer from "./MultiUserBranchDrawer";

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

const TABLE_PAGE_SIZE = 9;

const getPageRange = (
  pagination: PaginationState,
  totalRecords: number,
): string => {
  const pageAnchor = pagination.pageSize * pagination.pageIndex;
  return `${pageAnchor + 1}-${Math.min(
    pageAnchor + TABLE_PAGE_SIZE,
    totalRecords,
  )}`;
};

const userBranchesPassBranchFilter = (
  branchFilter: BranchResponseDTO | undefined,
  userBranches: BranchDTO[],
): boolean => {
  return (
    branchFilter === undefined ||
    userBranches.some((branch) => branchFilter.id === branch.id)
  );
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
  // Disclosure used for multi-user branch adder
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  const [
    selectedBranchesForMultiUser,
    setSelectedBranchesForMultiUser,
  ] = useState<BranchResponseDTO[]>([]);

  const handleMultiUserBranchMenuItemClicked = (
    clickedBranch: BranchResponseDTO,
  ) => {
    if (
      selectedBranchesForMultiUser.some(
        (branch) => branch.id === clickedBranch.id,
      )
    ) {
      setSelectedBranchesForMultiUser(
        selectedBranchesForMultiUser.filter(
          (branch) => branch.id !== clickedBranch.id,
        ),
      );
    } else {
      setSelectedBranchesForMultiUser([
        ...selectedBranchesForMultiUser,
        clickedBranch,
      ]);
    }
  };

  const [branchFilter, setBranchFilter] = useState<
    BranchResponseDTO | undefined
  >(undefined);

  const [
    userManagementTableTab,
    setUserManagementTableTab,
  ] = useState<AdminUserManagementTableTab>(
    AdminUserManagementTableTab.Volunteers,
  );

  const { loading, error } = useQuery(USERS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setAllEmployees(data.employeeUsers);
      setAllVolunteers(data.volunteerUsers);
    },
  });

  const handleTabClicked = (tab: AdminUserManagementTableTab) => {
    setUserManagementTableTab(tab);
    setRowSelection({});
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
        ? allVolunteers
            .filter((volunteer) =>
              userBranchesPassBranchFilter(branchFilter, volunteer.branches),
            )
            .map((volunteer) => ({
              firstName: volunteer.firstName,
              lastName: volunteer.lastName,
              pronouns: volunteer.pronouns ?? "N/A",
              email: volunteer.email,
              phoneNumber: volunteer.phoneNumber ?? "N/A",
            }))
        : allEmployees
            .filter((employee) =>
              userBranchesPassBranchFilter(branchFilter, employee.branches),
            )
            .map((employee) => ({
              firstName: employee.firstName,
              lastName: employee.lastName,
              pronouns: "N/A", // TODO: Update once pronouns are migrated
              email: employee.email,
              phoneNumber: employee.phoneNumber ?? "N/A",
            })),
    [allEmployees, allVolunteers, userManagementTableTab, branchFilter],
  );

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }: HeaderContext<User, unknown>) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }: CellContext<User, unknown>) => (
          <IndeterminateCheckbox
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
      {
        id: "profile",
        header: () => "",
        cell: ({ row }: CellContext<User, unknown>) => {
          const isVolunteer =
            userManagementTableTab === AdminUserManagementTableTab.Volunteers;
          let rowEmgName: string | undefined;
          let rowEmgEmail: string | undefined;
          let rowEmgPhone: string | undefined;
          let rowLangs: string[] = [];
          let rowSkills: string[] | undefined;
          let userBranches: BranchDTO[] = [];

          if (isVolunteer) {
            allVolunteers.some((user) => {
              if (user.email === row.original.email) {
                rowEmgEmail = user.emergencyContactEmail ?? "N/A";
                rowEmgName = user.emergencyContactName ?? "N/A";
                rowEmgPhone = user.emergencyContactPhone ?? "N/A";
                rowLangs = user.languages;
                rowSkills = user.skills?.map((skill) => skill.name);
                userBranches = user.branches;
                return true;
              }
              return false;
            });
          } else {
            allEmployees.some((user) => {
              if (user.email === row.original.email) {
                rowEmgEmail = user.emergencyContactEmail ?? "N/A";
                rowEmgName = user.emergencyContactName ?? "N/A";
                rowEmgPhone = user.emergencyContactPhone ?? "N/A";
                rowLangs = user.languages;
                userBranches = user.branches;
                return true;
              }
              return false;
            });
          }
          return (
            <UserManagementTableProfileCell
              firstName={row.original.firstName}
              lastName={row.original.lastName}
              pronouns={row.original.pronouns}
              email={row.original.email}
              phoneNumber={row.original.phoneNumber}
              emergencyContactName={rowEmgName ?? "N/A"}
              emergencyContactPhone={rowEmgPhone ?? "N/A"}
              emergencyContactEmail={rowEmgEmail ?? "N/A"}
              languages={rowLangs.map((lang) => getTitleCaseForOneWord(lang))}
              skills={rowSkills}
              isVolunteer={isVolunteer}
              branches={branches}
              userBranches={userBranches}
            />
          );
        },
      },
    ],
    [allEmployees, allVolunteers, branches, userManagementTableTab],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: TABLE_PAGE_SIZE,
      },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {error && <ErrorModal />}
      <MultiUserBranchDrawer
        userEmails={table
          .getSelectedRowModel()
          .rows.map((row) => row.original.email)}
        isOpen={isOpen}
        branches={branches}
        selectedBranches={selectedBranchesForMultiUser}
        onClose={() => {
          onClose();
          setSelectedBranchesForMultiUser([]);
        }}
        handleBranchMenuItemClicked={handleMultiUserBranchMenuItemClicked}
      />
      <Flex flexFlow="column" width="100%" height="100vh">
        <Navbar
          defaultIndex={Number(AdminPages.AdminUserManagement)}
          tabs={AdminNavbarTabs}
        />
        <AdminUserManagementPageHeader
          branches={branches}
          onOpenMultiUserBranchDrawer={onOpen}
          handleTabClicked={handleTabClicked}
          searchFilter={globalFilter ?? ""}
          onSearchFilterChange={(event) => setGlobalFilter(event.target.value)}
          setBranchFilter={setBranchFilter}
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
            {loading ? (
              <Loading />
            ) : (
              <ChakraTable variant="brand">
                <TableCaption textAlign="right">
                  <Flex alignItems="baseline" justifyContent="flex-end">
                    <Text fontWeight="bold">
                      {getPageRange(
                        table.getState().pagination,
                        table.getFilteredRowModel().rows.length,
                      )}
                    </Text>
                    <Text pl={1} pr={6}>
                      of {table.getPageCount()}
                    </Text>
                    <IconButton
                      aria-label="Previous page"
                      variant="ghost"
                      color="gray.700"
                      _hover={{
                        bg: "transparent",
                      }}
                      _active={{
                        bg: "transparent",
                      }}
                      icon={<ChevronLeftIcon />}
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    />
                    <IconButton
                      aria-label="Next page"
                      variant="ghost"
                      color="gray.700"
                      _hover={{
                        bg: "transparent",
                      }}
                      _active={{
                        bg: "transparent",
                      }}
                      icon={<ChevronRightIcon />}
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    />
                  </Flex>
                </TableCaption>
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
            )}
          </TableContainer>
        </Box>
      </Flex>
    </>
  );
};

export default AdminUserManagementPage;

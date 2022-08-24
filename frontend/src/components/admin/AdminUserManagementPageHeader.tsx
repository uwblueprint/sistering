import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  Tab,
  Button,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, EmailIcon, SearchIcon } from "@chakra-ui/icons";
import AddSuperAdminModal from "./AddSuperAdminModal";
import AddAdminModal from "./AddAdminModal";
import AddVolunteerModal from "./AddVolunteerModal";
import UserInvitesModal from "./UserInvitesModal";
import { BranchResponseDTO } from "../../types/api/BranchTypes";

export enum AdminUserManagementTableTab {
  Volunteers,
  Admins,
}

type AdminUserManagementPageHeaderProps = {
  branches: BranchResponseDTO[];
  onOpenMultiUserBranchDrawer: () => void;
  handleTabClicked: (tab: AdminUserManagementTableTab) => void;
  onSearchFilterChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchFilter: string;
  setBranchFilter: Dispatch<SetStateAction<BranchResponseDTO | undefined>>;
};

const AdminUserManagementPageHeader = ({
  branches,
  onOpenMultiUserBranchDrawer,
  handleTabClicked,
  onSearchFilterChange,
  searchFilter,
  setBranchFilter,
}: AdminUserManagementPageHeaderProps): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isOpen: isOpenForVolunteer,
    onOpen: onOpenForVolunteer,
    onClose: onCloseForVolunteer,
  } = useDisclosure();
  const {
    isOpen: isOpenForEmployee,
    onOpen: onOpenForEmployee,
    onClose: onCloseForEmployee,
  } = useDisclosure();
  const {
    isOpen: isOpenForAdmin,
    onOpen: onOpenForAdmin,
    onClose: onCloseForAdmin,
  } = useDisclosure();

  return (
    <>
      <UserInvitesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <VStack alignItems="flex-start" px="100px" pt="48px" spacing={0}>
        <HStack w="full" mb="16px">
          <Text textStyle="display-small-semibold">User Management</Text>
          <Spacer />
          <Button variant="outline" onClick={onOpenMultiUserBranchDrawer}>
            Edit Branch Access
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <EmailIcon boxSize={4} mr={3} />
            Invitations
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Add user"
              icon={<AddIcon boxSize={3} />}
            />
            <MenuList>
              <MenuItem
                textStyle="caption"
                fontWeight="medium"
                onClick={onOpenForVolunteer}
              >
                Add new volunteer
              </MenuItem>
              <AddVolunteerModal
                isOpen={isOpenForVolunteer}
                onClose={onCloseForVolunteer}
              />
              <MenuItem
                textStyle="caption"
                fontWeight="medium"
                onClick={onOpenForEmployee}
              >
                Add new employee
              </MenuItem>
              <AddAdminModal
                isOpen={isOpenForEmployee}
                onClose={onCloseForEmployee}
              />
              <MenuItem
                textStyle="caption"
                fontWeight="medium"
                onClick={onOpenForAdmin}
              >
                Add new admin
              </MenuItem>
              <AddSuperAdminModal
                isOpen={isOpenForAdmin}
                onClose={onCloseForAdmin}
              />
            </MenuList>
          </Menu>
        </HStack>
        <HStack w="full" alignItems="flex-start" spacing={0}>
          <Tabs pt="10px">
            <TabList>
              <Tab
                _hover={{
                  borderColor: "currentColor",
                }}
                _selected={{
                  color: "violet",
                  borderColor: "currentColor",
                }}
                py="8px"
                onClick={() =>
                  handleTabClicked(AdminUserManagementTableTab.Volunteers)
                }
              >
                Volunteers
              </Tab>
              <Tab
                _hover={{
                  borderColor: "currentColor",
                }}
                _selected={{
                  color: "violet",
                  borderColor: "currentColor",
                }}
                py="8px"
                onClick={() =>
                  handleTabClicked(AdminUserManagementTableTab.Admins)
                }
              >
                Employees
              </Tab>
            </TabList>
          </Tabs>
          <Spacer />
          <HStack>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search"
                w="368px"
                onChange={onSearchFilterChange}
                value={searchFilter}
              />
            </InputGroup>
            <Select
              maxWidth="175px"
              placeholder="All branches"
              onChange={(event) => {
                setBranchFilter(
                  branches.find((branch) => branch.id === event.target.value),
                );
              }}
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>
      </VStack>
    </>
  );
};

export default AdminUserManagementPageHeader;

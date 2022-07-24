import React, { useState } from "react";
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
  onOpenProfileDrawer: () => void;
  handleTabClicked: (tab: AdminUserManagementTableTab) => void;
};

const AdminUserManagementPageHeader = ({
  branches,
  onOpenProfileDrawer,
  handleTabClicked,
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
          <Button variant="outline" onClick={onOpenProfileDrawer}>
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
                Add new administrator
              </MenuItem>
              <AddAdminModal
                isOpen={isOpenForEmployee}
                onClose={onCloseForEmployee}
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
                Admins
              </Tab>
            </TabList>
          </Tabs>
          <Spacer />
          <HStack>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input type="text" placeholder="Search" w="368px" />
            </InputGroup>
            <Select placeholder="All branches">
              {branches.map((branch) => (
                <option key={branch.id}>{branch.name}</option>
              ))}
            </Select>
          </HStack>
        </HStack>
      </VStack>
    </>
  );
};

export default AdminUserManagementPageHeader;

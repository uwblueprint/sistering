import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Text,
  Box,
  Flex,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import colors from "../../../../theme/colors";

type ProfileDrawerProps = {
  isOpen: boolean;
  branches: string[];
  selectedBranches: string[];
  onClose: () => void;
  handleBranchMenuItemClicked: (item: string) => void;
};

const ProfileDrawer = ({
  isOpen,
  branches,
  selectedBranches,
  onClose,
  handleBranchMenuItemClicked,
}: ProfileDrawerProps): React.ReactElement => {
  const [isEditingBranches, setIsEditingBranches] = useState(false);

  /*
   * TODO: Edit and save function will likely need to be abstracted
   *       into their own functions at a later point.
   */
  const handleEditSaveButtonClicked = () => {
    setIsEditingBranches(!isEditingBranches);
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>7 User(s) Selected</DrawerHeader>
          <DrawerBody>
            <Box>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">Branches</Text>
                {isEditingBranches ? (
                  <Button
                    variant="outline"
                    onClick={handleEditSaveButtonClicked}
                    py="1"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleEditSaveButtonClicked}
                    py="1"
                  >
                    Edit
                  </Button>
                )}
              </Flex>
              <Flex mt={5} flexWrap="wrap">
                {isEditingBranches ? (
                  <Menu closeOnSelect={false}>
                    <MenuButton
                      as={Button}
                      backgroundColor={colors.background.white}
                      color={colors.text.default}
                      borderRadius="md"
                      borderWidth="1px"
                      rightIcon={<ChevronDownIcon />}
                      width="100%"
                      textAlign="left"
                    >
                      {selectedBranches.length}{" "}
                      {selectedBranches.length === 1 ? "branch" : "branches"}
                    </MenuButton>
                    <MenuList>
                      <MenuOptionGroup title="Branch Access" type="checkbox">
                        {branches.map((branch, index) => {
                          return (
                            <MenuItemOption
                              key={index}
                              value={branch}
                              onClick={() =>
                                handleBranchMenuItemClicked(branch)
                              }
                            >
                              {branch}
                            </MenuItemOption>
                          );
                        })}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                ) : (
                  branches.map((branch, index) => {
                    return (
                      <Tag key={index} size="md" height="32px" mr={4} mb={2}>
                        {branch}
                      </Tag>
                    );
                  })
                )}
              </Flex>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProfileDrawer;

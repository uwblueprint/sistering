import React, { useState } from "react";
import {
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
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";

type ProfileDrawerProps = {
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
};

const MultiBranchSelector = ({
  branches,
  selectedBranches,
  handleBranchMenuItemClicked,
}: ProfileDrawerProps): React.ReactElement => {
  const [isEditingBranches, setIsEditingBranches] = useState(false);

  const handleEditSaveButtonClicked = () => {
    setIsEditingBranches(!isEditingBranches);
  };

  return (
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
              _hover={{ bg: colors.background.white }}
              _active={{ bg: colors.background.white }}
            >
              {selectedBranches.length}{" "}
              {selectedBranches.length === 1 ? "branch" : "branches"}
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                title="Branch Access"
                type="checkbox"
                value={selectedBranches.map((branch) => branch.id)}
              >
                {branches.map((branch) => {
                  return (
                    <MenuItemOption
                      key={branch.id}
                      value={branch.id}
                      onClick={() => handleBranchMenuItemClicked(branch)}
                    >
                      {branch.name}
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        ) : (
          selectedBranches.map((branch) => {
            return (
              <Tag key={branch.id} size="md" height="32px" mr={4} mb={2}>
                {branch.name}
              </Tag>
            );
          })
        )}
      </Flex>
    </Box>
  );
};

export default MultiBranchSelector;

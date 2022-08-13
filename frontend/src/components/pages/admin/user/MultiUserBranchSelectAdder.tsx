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
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { gql, useMutation } from "@apollo/client";
import colors from "../../../../theme/colors";
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";

type MultiUserBranchSelectAdderProps = {
  userEmails: string[];
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
  onSave: () => void;
};

const BULK_ADD_USER_BRANCHES = gql`
  mutation MultiBranchSelector_UpdateUserBranches(
    $emails: [String!]!
    $branchIds: [ID!]!
  ) {
    appendBranchesForMultipleUsersByEmail(
      emails: $emails
      branchIds: $branchIds
    )
  }
`;

const MultiUserBranchSelectAdder = ({
  userEmails,
  branches,
  selectedBranches,
  handleBranchMenuItemClicked,
  onSave,
}: MultiUserBranchSelectAdderProps): React.ReactElement => {
  const toast = useToast();
  const [isEditingBranches, setIsEditingBranches] = useState(false);

  const [bulkAddUserBranches] = useMutation(BULK_ADD_USER_BRANCHES, {
    refetchQueries: ["AdminUserManagementPage_Users"],
    variables: {
      emails: userEmails,
      branchIds: selectedBranches.map((branch) => branch.id),
    },
  });

  const handleEditSaveButtonClicked = async () => {
    if (isEditingBranches) {
      try {
        await bulkAddUserBranches();
        toast({
          title: "User Branches Updated",
          description: `${userEmails.length} user(s) added to new branch(es).`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error: unknown) {
        toast({
          title: "Failed to add branches for users.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      onSave();
    }
    setIsEditingBranches(!isEditingBranches);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">Add a Branch</Text>
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

export default MultiUserBranchSelectAdder;

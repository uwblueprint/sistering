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
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { gql, useMutation } from "@apollo/client";
import colors from "../../../../theme/colors";
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";
import DeleteModal from "../../../admin/DeleteModal";
import OverflownText from "../../../common/OverflownText";

type MultiBranchSelectorProps = {
  userEmail: string;
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
  isVolunteer?: boolean;
};

const UPDATE_USER_BRANCHES = gql`
  mutation MultiBranchSelector_UpdateUserBranches(
    $email: String!
    $branchIds: [ID!]!
  ) {
    updateUserBranchesByEmail(email: $email, branchIds: $branchIds)
  }
`;

const MultiBranchSelector = ({
  userEmail,
  branches,
  selectedBranches,
  handleBranchMenuItemClicked,
  isVolunteer,
}: MultiBranchSelectorProps): React.ReactElement => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditingBranches, setIsEditingBranches] = useState(false);

  const [updateUserBranches] = useMutation(UPDATE_USER_BRANCHES, {
    variables: {
      email: userEmail,
      branchIds: selectedBranches.map((branch) => branch.id),
    },
    refetchQueries: ["AdminUserManagementPage_Users"],
  });

  const handleEditSaveButtonClicked = async () => {
    if (isEditingBranches) {
      try {
        await updateUserBranches();
      } catch (error: unknown) {
        toast({
          title: "Failed to update user branches.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
    setIsEditingBranches(!isEditingBranches);
  };

  return (
    <>
      <DeleteModal
        body="Volunteer sign ups for removed branches will be permanently deleted."
        title="Update this volunteer's branches?"
        confirmText="Confirm"
        isOpen={isOpen}
        onClose={onClose}
        onDelete={handleEditSaveButtonClicked}
      />
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">Branches</Text>
          {isEditingBranches ? (
            <Button
              variant="outline"
              onClick={isVolunteer ? onOpen : handleEditSaveButtonClicked}
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
              <MenuList maxH="400px" maxW="448px" overflowY="scroll">
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
                        <Text>{branch.name}</Text>
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
                  <OverflownText>{branch.name}</OverflownText>
                </Tag>
              );
            })
          )}
        </Flex>
      </Box>
    </>
  );
};

export default MultiBranchSelector;

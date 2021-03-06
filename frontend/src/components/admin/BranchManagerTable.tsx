import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Tag,
  IconButton,
  useBoolean,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { BranchResponseDTO } from "../../types/api/BranchTypes";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import ErrorModal from "../common/ErrorModal";

type BranchManagerTableProps = {
  branches: BranchResponseDTO[];
};

const UPDATE_BRANCH = gql`
  mutation BranchManagerTable_UpdateBranch(
    $id: ID!
    $branch: BranchRequestDTO!
  ) {
    updateBranch(id: $id, branch: $branch) {
      id
    }
  }
`;

const DELETE_BRANCH = gql`
  mutation BranchManagerTable_DeleteBranch($id: ID!) {
    deleteBranch(id: $id)
  }
`;

const BranchManagerTable = ({
  branches,
}: BranchManagerTableProps): React.ReactElement => {
  const [isEditModalOpen, setIsEditModalOpen] = useBoolean(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useBoolean(false);
  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState<BranchResponseDTO | null>(null);

  const [updateBranch, { error: updateBranchError }] = useMutation(
    UPDATE_BRANCH,
    {
      refetchQueries: [
        "BranchManagerModal_Branches",
        "AdminHomepageHeader_Branches",
      ],
    },
  );

  const [deleteBranch, { error: deleteBranchError }] = useMutation(
    DELETE_BRANCH,
    {
      refetchQueries: [
        "BranchManagerModal_Branches",
        "AdminHomepageHeader_Branches",
      ],
    },
  );

  const handleBranchUpdate = async (branchName: string) => {
    if (selectedBranch) {
      await updateBranch({
        variables: {
          id: selectedBranch.id,
          branch: { name: branchName },
        },
      });
    }
  };

  const handleBranchDelete = async () => {
    if (selectedBranch) {
      await deleteBranch({
        variables: {
          id: selectedBranch.id,
        },
      });
    }
  };

  return (
    <>
      {(updateBranchError || deleteBranchError) && <ErrorModal />}
      <EditModal
        title="Edit Branch Name"
        isOpen={isEditModalOpen}
        content={selectedBranch ? selectedBranch.name : ""}
        onClose={() => {
          setIsEditModalOpen.off();
          setSelectedBranch(null);
        }}
        onEdit={handleBranchUpdate}
      />
      <DeleteModal
        title="Delete Branch?"
        isOpen={isDeleteModalOpen}
        body={`Are you sure you want to permanently delete the branch "${
          selectedBranch ? selectedBranch.name : ""
        }"?`}
        onClose={() => {
          setIsDeleteModalOpen.off();
          setSelectedBranch(null);
        }}
        onDelete={handleBranchDelete}
      />
      <TableContainer
        border="2px"
        borderRadius="12px"
        borderColor="background.dark"
      >
        <Table variant="brand">
          <Tbody>
            {branches.map((branch) => (
              <Tr key={Number(branch.id)}>
                <Td>
                  <Tag>{branch.name}</Tag>
                </Td>
                <Td textAlign="end">
                  <IconButton
                    aria-label="Edit branch"
                    variant="ghost"
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    icon={<EditIcon color="text.default" boxSize="24px" />}
                    onClick={() => {
                      setIsEditModalOpen.on();
                      setSelectedBranch(branch);
                    }}
                  />
                  <IconButton
                    aria-label="Delete branch"
                    variant="ghost"
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    icon={<DeleteIcon color="text.default" boxSize="24px" />}
                    onClick={() => {
                      setIsDeleteModalOpen.on();
                      setSelectedBranch(branch);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BranchManagerTable;

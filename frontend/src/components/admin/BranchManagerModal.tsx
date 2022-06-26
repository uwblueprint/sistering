import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  HStack,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  Text,
  Spacer,
  useBoolean,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import cloneDeep from "lodash.clonedeep";

import BranchManagerTable from "./BranchManagerTable";
import EditModal from "./EditModal";
import ErrorModal from "../common/ErrorModal";
import {
  BranchQueryResponse,
  BranchResponseDTO,
} from "../../types/api/BranchTypes";

type BranchManagerModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const BRANCHES = gql`
  query BranchManagerModal_Branches {
    branches {
      id
      name
    }
  }
`;

const CREATE_BRANCH = gql`
  mutation BranchManagerModal_CreateBranch($branch: BranchRequestDTO!) {
    createBranch(branch: $branch) {
      id
    }
  }
`;

const BranchManagerModal = ({
  isOpen,
  onClose,
}: BranchManagerModalProps): React.ReactElement => {
  const [currentBranches, setCurrentBranches] = useState<BranchResponseDTO[]>(
    [],
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useBoolean(false);
  const [createBranch, { error: createBranchError }] = useMutation(
    CREATE_BRANCH,
    {
      refetchQueries: [{ query: BRANCHES }],
    },
  );

  const handleBranchCreate = async (branchName: string) => {
    await createBranch({
      variables: {
        branch: { name: branchName },
      },
    });
  };

  useQuery<BranchQueryResponse>(BRANCHES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const branchesCopy = cloneDeep(data.branches);
      branchesCopy.sort((a, b) => Number(a.id) - Number(b.id));
      setCurrentBranches(branchesCopy);
    },
  });

  return (
    <>
      {createBranchError && <ErrorModal />}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="1000px" h="700px" py="50px" px="70px">
          <ModalHeader>
            <HStack>
              <Text textStyle="display-small-regular">Branch Manager</Text>
              <Spacer />
              <Button onClick={setIsCreateModalOpen.on}>
                <EditModal
                  title="Add a branch"
                  isOpen={isCreateModalOpen}
                  content=""
                  onClose={setIsCreateModalOpen.off}
                  onEdit={handleBranchCreate}
                />
                <AddIcon boxSize={3} mr={3} />
                Add a branch
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto">
            <BranchManagerTable branches={currentBranches} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BranchManagerModal;

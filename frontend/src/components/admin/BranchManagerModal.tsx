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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React from "react";
import BranchManagerTable from "./BranchManagerTable";

type BranchManagerModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const BranchManagerModal = ({
  isOpen,
  onClose,
}: BranchManagerModalProps): React.ReactElement => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="1000px" h="700px" py="50px" px="70px">
        <ModalHeader>
          <HStack>
            <Text textStyle="display-small-regular">Branch Manager</Text>
            <Spacer />
            <Button>
              <AddIcon boxSize={3} mr={3} />
              Add a branch
            </Button>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BranchManagerTable />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BranchManagerModal;

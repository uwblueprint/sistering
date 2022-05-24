import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

type DeleteModalProps = {
  title: string;
  isOpen: boolean;
  body: string;
  onClose(): void;
  onDelete(): void;
};

const DeleteModal = ({
  title,
  isOpen = false,
  body,
  onClose = () => {},
  onDelete,
}: DeleteModalProps): React.ReactElement => {
  const initialRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const submitDeleteRequest = async () => {
    await onDelete();
  };

  const handleDeleteClick = async () => {
    setIsLoading(true);
    await submitDeleteRequest();
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius={0} p="10px">
        <ModalHeader py="11px">
          <Text textStyle="body-bold">{title}</Text>
        </ModalHeader>
        <ModalBody>
          <Text textStyle="body-regular">{body}</Text>
        </ModalBody>
        <ModalFooter mt="10px" py="6px" px="12px">
          <Button
            mr="17px"
            borderRadius="4px"
            onClick={onClose}
            colorScheme="gray"
            textStyle="button-semibold"
          >
            Cancel
          </Button>
          <Button
            borderRadius="4px"
            onClick={handleDeleteClick}
            ref={initialRef}
            colorScheme="red"
            textStyle="button-semibold"
            fontWeight={700}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;

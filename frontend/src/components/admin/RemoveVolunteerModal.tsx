import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useRef } from "react";

type RemoveVolunteerModalProps = {
  name: string;
  isOpen: boolean;
  onClose(): void;
};

const RemoveVolunteerModal = ({
  name = "",
  isOpen = false,
  onClose = () => {},
}: RemoveVolunteerModalProps): React.ReactElement => {
  const initialRef = React.useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius={8} pt={3} pl={3} pr={3} pb={2}>
        <ModalHeader textStyle="body-bold" marginBottom={0} pb={2}>
          Remove volunteer?
        </ModalHeader>
        <ModalBody textStyle="body-regular" mt={0}>
          Are you sure you want to remove {name}?
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button
              onClick={onClose}
              borderRadius="4px"
              colorScheme="gray"
              textStyle="button-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                /* This is where we would add logic to call API endpoint to remove the volunteer */
                onClose();
              }}
              ref={initialRef}
              borderRadius="4px"
              colorScheme="red"
              textStyle="button-semibold"
            >
              Remove
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveVolunteerModal;

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
import React from "react";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={0} padding="10px">
        <ModalHeader fontWeight={700} fontStyle="heading">
          Remove volunteer?
        </ModalHeader>
        <ModalBody textStyle="caption">
          Are you sure you want to remove {name}?
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button
              onClick={onClose}
              borderRadius="4px"
              bgColor="gray.100"
              color="gray.900"
              textStyle="button-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                /* This is where we would add logic to call API endpoint to remove the volunteer */
                onClose();
              }}
              borderRadius="4px"
              bgColor="red.500"
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

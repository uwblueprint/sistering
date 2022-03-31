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
  const initialRef = React.useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius={0} p="10px">
        <ModalHeader mt="10px" ml="10px" py="11px" px="15px">
          <Text textStyle="body-bold">Remove volunteer?</Text>
        </ModalHeader>
        <ModalBody>
          <Text textStyle="body-regular">
            Are you sure you want to remove {name}?
          </Text>
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
            onClick={() => {
              /* This is where we would add logic to call API endpoint to remove the volunteer */
              onClose();
            }}
            ref={initialRef}
            colorScheme="red"
            textStyle="button-semibold"
            fontWeight={700}
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveVolunteerModal;

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import React from "react";

const ErrorModal = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useBoolean(true);

  return (
    <Modal isOpen={isOpen} onClose={setIsOpen.off} isCentered>
      <ModalOverlay />
      <ModalContent w="450px" py={1} borderRadius={0}>
        <ModalHeader pb={2}>
          <Text textStyle="body-bold">Error</Text>
        </ModalHeader>
        <ModalBody pb={0}>
          <Text textStyle="caption" fontWeight="medium">
            The server encountered an unexpected error while handling your
            request. Please try again.
          </Text>
        </ModalBody>
        <ModalFooter pb={3} pt={3}>
          <Button w="80px" onClick={setIsOpen.off} textStyle="button-semibold">
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;

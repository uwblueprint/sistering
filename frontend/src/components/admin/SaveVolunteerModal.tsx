import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

type SaveVolunteerModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const SaveVolunteerModal = ({
  isOpen = false,
  onClose = () => {},
}: SaveVolunteerModalProps): React.ReactElement => {
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
        <ModalHeader py="11px">
          <Flex dir="horizontal" justify="space-between" alignItems="center">
            <Text textStyle="body-bold">Save Changes?</Text>
            <CloseIcon boxSize="16px" onClick={() => {}} cursor="pointer" />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Text textStyle="body-regular">
            There are unsaved changes made to volunteer list.
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
            Don&apos;t Save
          </Button>
          <Button
            borderRadius="4px"
            onClick={() => {
              /* This is where we would add logic to call API endpoint to remove the volunteer */
              onClose();
            }}
            ref={initialRef}
            textStyle="button-semibold"
            fontWeight={700}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveVolunteerModal;

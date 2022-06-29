import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Input,
} from "@chakra-ui/react";
import React, { useState, ChangeEvent, useEffect } from "react";

type EditModalProps = {
  title: string;
  isOpen: boolean;
  content: string;
  onClose(): void;
  onEdit: (editChange: string) => Promise<void>;
};

const EditModal = ({
  title,
  isOpen = false,
  content,
  onClose = () => {},
  onEdit,
}: EditModalProps): React.ReactElement => {
  const initialRef = React.useRef(null);

  const [value, setValue] = useState(content || "");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = async () => {
    setIsLoading(true);
    await onEdit(value);
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    setValue(content);
  }, [content]);

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
          <Input
            value={value}
            placeholder={value}
            onChange={handleChange}
            size="sm"
          />
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
            onClick={handleEditClick}
            ref={initialRef}
            colorScheme="brand"
            textStyle="button-semibold"
            fontWeight={700}
            isLoading={isLoading}
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;

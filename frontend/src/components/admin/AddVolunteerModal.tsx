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
import React, { useState, ChangeEvent } from "react";
import { gql, useMutation } from "@apollo/client";
import ErrorModal from "../common/ErrorModal";

type AddUserModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const CREATE_VOLUNTEER_INVITE = gql`
  mutation testCreateUserInvite($email: String!) {
    createUserInvite(email: $email, role: VOLUNTEER) {
      uuid
    }
  }
`;

const AddVolunteerModal = ({
  isOpen = false,
  onClose = () => {},
}: AddUserModalProps): React.ReactElement => {
  const initialRef = React.useRef(null);

  const [email, setEmail] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const [isLoading, setIsLoading] = useState(false);

  const [createVolunteerInvite, { error: createUserInviteError }] = useMutation(
    CREATE_VOLUNTEER_INVITE,
  );

  const onSubmit = async () => {
    await createVolunteerInvite({
      variables: {
        email,
      },
    });
    // run graphql mutation to create user invite with email value
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit();
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
      {createUserInviteError && <ErrorModal />}
      <ModalContent borderRadius={0} p="10px">
        <ModalHeader py="11px">
          <Text textStyle="body-bold">Add New Volunteer</Text>
        </ModalHeader>
        <ModalBody>
          <Text textStyle="body-regular">
            Enter the email of the user you would like to invite. The new
            volunteer will appear in the User Management table once the account
            has been activated.
          </Text>
          <Input
            value={email}
            placeholder="Enter volunteer email"
            onChange={handleChange}
            size="sm"
            marginTop="12px"
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
            onClick={handleSubmit}
            ref={initialRef}
            colorScheme="brand"
            textStyle="button-semibold"
            fontWeight={700}
            isLoading={isLoading}
          >
            Send Invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddVolunteerModal;

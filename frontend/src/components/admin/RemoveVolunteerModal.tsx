import { gql, useMutation } from "@apollo/client";
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
import {
  ShiftSignupResponseDTO,
  ShiftSignupStatus,
} from "../../types/api/SignupTypes";

type RemoveVolunteerModalProps = {
  name: string;
  isOpen: boolean;
  shiftId: string;
  userId: string;
  status: ShiftSignupStatus;
  numVolunteers: number;
  note: string;
  onClose(): void;
};

const UPDATE_SHIFT_SIGNUP = gql`
  mutation UpdateShiftSignup(
    $shiftId: ID!
    $userId: ID!
    $update: UpdateShiftSignupRequestDTO!
  ) {
    updateShiftSignup(shiftId: $shiftId, userId: $userId, update: $update) {
      shiftId
      userId
      numVolunteers
      note
      status
      shiftStartTime
      shiftEndTime
    }
  }
`;

const RemoveVolunteerModal = ({
  name = "",
  isOpen = false,
  shiftId,
  userId,
  status,
  numVolunteers,
  note,
  onClose = () => {},
}: RemoveVolunteerModalProps): React.ReactElement => {
  const initialRef = React.useRef(null);

  const [updateShiftSignup] = useMutation<{ shift: ShiftSignupResponseDTO }>(
    UPDATE_SHIFT_SIGNUP,
  );

  const submitUpdateRequest = async () => {
    await updateShiftSignup({
      variables: {
        shiftId,
        userId,
        update: {
          numVolunteers,
          note,
          status,
        },
      },
    });
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
              submitUpdateRequest();
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

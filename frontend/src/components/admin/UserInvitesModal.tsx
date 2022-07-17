import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import UserInvitesTable from "./UserInvitesTable";
import { Role } from "../../types/AuthTypes";

type UserInvitesModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const UserInvitesModal = ({
  isOpen,
  onClose,
}: UserInvitesModalProps): React.ReactElement => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="1000px" h="700px" py="50px" px="70px">
          <ModalHeader>
            <Text textStyle="display-small-regular">Pending Invitations</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto">
            <UserInvitesTable
              invites={[
                {
                  email: "admin@email",
                  createdAt: new Date(),
                  role: Role.Admin,
                  uuid: "uuid",
                },
                {
                  email: "volunteer@email",
                  createdAt: new Date(),
                  role: Role.Volunteer,
                  uuid: "uuid",
                },
              ]}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserInvitesModal;

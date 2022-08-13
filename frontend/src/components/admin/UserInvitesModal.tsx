import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import UserInvitesTable from "./UserInvitesTable";
import {
  UserInviteDTO,
  UserInvitesQueryResponse,
} from "../../types/api/UserInviteTypes";

type UserInvitesModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const INVITES = gql`
  query UserInvitesModal_getUserInvites {
    getUserInvites {
      uuid
      email
      role
      createdAt
    }
  }
`;

const UserInvitesModal = ({
  isOpen,
  onClose,
}: UserInvitesModalProps): React.ReactElement => {
  const [userInvites, setUserInvites] = useState<UserInviteDTO[]>([]);

  useQuery<UserInvitesQueryResponse>(INVITES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setUserInvites(data.getUserInvites);
    },
  });

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
            <UserInvitesTable invites={userInvites} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserInvitesModal;

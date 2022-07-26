import React, { useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { gql, useMutation } from "@apollo/client";

import { UserInviteDTO } from "../../types/api/UserInviteTypes";
import {
  formatDateMonthYear,
  formatTimeHourMinutes,
} from "../../utils/DateTimeUtils";
import { Role } from "../../types/AuthTypes";
import ErrorModal from "../common/ErrorModal";

type UserInvitesTableProps = {
  invites: UserInviteDTO[];
};

const DELETE_INVITE = gql`
  mutation UserInvitesTable_deleteUserInvite($email: String!) {
    deleteUserInvite(email: $email) {
      uuid
    }
  }
`;

const UserInvitesTable = ({
  invites,
}: UserInvitesTableProps): React.ReactElement => {
  const [selectedTab, setSelectedTab] = useState(Role.Volunteer);

  const [deleteBranch, { error: deleteInviteError }] = useMutation(
    DELETE_INVITE,
    {
      refetchQueries: ["UserInvitesModal_getUserInvites"],
    },
  );

  return (
    <>
      {deleteInviteError && <ErrorModal />}
      <TableContainer
        border="2px"
        borderRadius="12px"
        borderColor="background.dark"
      >
        <Tabs w="fit-content" pt="6px" mb="10px">
          <TabList>
            <Tab
              _hover={{
                borderColor: "currentColor",
              }}
              _selected={{
                color: "violet",
                borderColor: "currentColor",
              }}
              py="8px"
              onClick={() => setSelectedTab(Role.Volunteer)}
            >
              Volunteers
            </Tab>
            <Tab
              _hover={{
                borderColor: "currentColor",
              }}
              _selected={{
                color: "violet",
                borderColor: "currentColor",
              }}
              py="8px"
              onClick={() => setSelectedTab(Role.Admin)}
            >
              Admins
            </Tab>
          </TabList>
        </Tabs>
        <Table variant="brand">
          <Thead>
            <Tr>
              <Th w="400px">Email</Th>
              <Th w="200px">Date Sent</Th>
              <Th>Time Sent</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {invites
              .filter((invite) => invite.role === selectedTab)
              .map((invite, i) => (
                <Tr key={i}>
                  <Td>{invite.email}</Td>
                  <Td>{formatDateMonthYear(invite.createdAt)}</Td>
                  <Td>{formatTimeHourMinutes(invite.createdAt)}</Td>
                  <Td textAlign="end">
                    <IconButton
                      aria-label="Cancel invite"
                      variant="ghost"
                      _hover={{
                        bg: "transparent",
                      }}
                      _active={{
                        bg: "transparent",
                      }}
                      icon={<CloseIcon color="text.default" boxSize="13px" />}
                      onClick={async () => {
                        await deleteBranch({
                          variables: {
                            email: invite.email,
                          },
                        });
                      }}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserInvitesTable;

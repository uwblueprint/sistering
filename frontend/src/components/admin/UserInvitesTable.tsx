import React from "react";
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
import { UserInviteDTO } from "../../types/api/UserInviteTypes";
import {
  formatDateMonthYear,
  formatTimeHourMinutes,
} from "../../utils/DateTimeUtils";

type UserInvitesTableProps = {
  invites: UserInviteDTO[];
};

const UserInvitesTable = ({
  invites,
}: UserInvitesTableProps): React.ReactElement => {
  return (
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
          {invites.map((invite, i) => (
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
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UserInvitesTable;

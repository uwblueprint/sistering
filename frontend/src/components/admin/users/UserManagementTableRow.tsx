import {
  Box,
  Checkbox,
  Icon,
  Tr,
  Td,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { MdMoreHoriz } from "react-icons/md";
import React from "react";
import ProfileDrawer from "./ProfileDrawer";

type UserManagementTableRowProps = {
  firstName: string;
  lastName: string;
  pronouns: string;
  email: string;
  phoneNumber: string;
  checked: boolean;

  // TODO: Replace param type
  onCheck: (params: any) => any;
};

const UserManagementTableRow = ({
  firstName,
  lastName,
  pronouns,
  email,
  phoneNumber,
  checked,
  onCheck,
}: UserManagementTableRowProps): React.ReactElement => {
  // For the ProfileDrawer.
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tr bgColor={checked ? "purple.50" : undefined}>
      <Td mr={0} pr={0}>
        <Box position="relative">
          <Checkbox position="absolute" top={0} bottom={0} onChange={onCheck} />
        </Box>
      </Td>
      <Td>
        <Text>{firstName}</Text>
      </Td>
      <Td>
        <Text>{lastName}</Text>
      </Td>
      <Td>
        <Text>{pronouns}</Text>
      </Td>
      <Td>
        <Text>{email}</Text>
      </Td>
      <Td>
        <Text>{phoneNumber}</Text>
      </Td>
      <Td textAlign="right">
        <Tooltip label="View details" placement="bottom-start">
          <Box as="span">
            <Icon
              as={MdMoreHoriz}
              w={6}
              h={6}
              onClick={onOpen}
              cursor="pointer"
            />
          </Box>
        </Tooltip>
        <ProfileDrawer
          isOpen={isOpen}
          onClose={onClose}
          firstName={firstName}
          lastName={lastName}
        />
      </Td>
    </Tr>
  );
};

export default UserManagementTableRow;

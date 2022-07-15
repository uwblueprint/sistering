import { Box, Checkbox, Icon, Tr, Td, Th, Text, Tooltip, Button } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { MdMoreHoriz } from "react-icons/md"
import React from "react";
import {
  formatTimeHourMinutes,
  getElapsedHours,
} from "../../../utils/DateTimeUtils";
import { ShiftWithSignupAndVolunteerResponseDTO } from "../../../types/api/ShiftTypes";
import {
  DeleteSignupRequest,
  SignupRequest,
} from "../../../types/api/SignupTypes";

type UserManagementTableRowProps = {
  firstName: string;
  lastName: string;
  pronouns: string;
  email: string;
  phoneNumber: string;
};

const UserManagementTableRow = ({
  firstName,
  lastName,
  pronouns,
  email,
  phoneNumber
}: UserManagementTableRowProps): React.ReactElement => {

  const [checked, setChecked] = React.useState(false)

  return (
    <Tr bgColor={checked ? "purple.50" : undefined}>
      <Td mr={0} pr={0}>
        <Box position="relative">
          <Checkbox position="absolute" top={0} bottom={0} onChange={() => setChecked(!checked)}
/>
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
        <Tooltip label='View details' placement='bottom-start'>
          <span>
            <Icon as={MdMoreHoriz} w={6} h={6} />
          </span>
        </Tooltip>
      </Td>  
    </Tr>
  );
};

export default UserManagementTableRow;



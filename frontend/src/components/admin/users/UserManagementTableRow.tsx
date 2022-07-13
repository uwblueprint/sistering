import { Checkbox, Icon, Tr, Td, Text, Button } from "@chakra-ui/react";
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

  return (
    <Tr>
      <Td>
        <Checkbox/>
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
      <Td>
        <Icon as={MdMoreHoriz} />
      </Td>  
    </Tr>
  );
};

export default UserManagementTableRow;



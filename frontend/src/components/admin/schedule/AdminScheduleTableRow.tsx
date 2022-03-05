import { Td, Text, Tr } from "@chakra-ui/react";
import React from "react";

type AdminScheduleTableRowProps = {
  volunteer?: string;
  postingStart?: Date;
  postingEnd?: Date;
};

const AdminScheduleTableRow = ({
  volunteer,
  postingStart,
  postingEnd,
}: AdminScheduleTableRowProps): React.ReactElement => {
  // Case 1: No shifts available
  if (!postingStart || !postingEnd) {
    return (
      <Tr>
        <Td>
          <Text color="text.gray">No shifts available</Text>
        </Td>
      </Tr>
    );
  }
  // Case 2: Shift is available but no volunteer is assigned
  if (!volunteer) {
    return <></>;
  }
  // Case 3: Shift is available and volunteer is assigned
  return <></>;
};

export default AdminScheduleTableRow;

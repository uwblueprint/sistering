import { Button, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";

type AdminScheduleTableRowProps = {
  volunteer?: string;
  userId?: string;
  postingStart?: Date;
  postingEnd?: Date;
};

const AdminScheduleTableRow = ({
  volunteer,
  userId,
  postingStart,
  postingEnd,
}: AdminScheduleTableRowProps): React.ReactElement => {
  // No shifts available
  if (!postingStart || !postingEnd) {
    return (
      <Tr>
        <Td colSpan={3}>
          <Text color="text.gray">No shifts available</Text>
        </Td>
      </Tr>
    );
  }
  // Shift is available
  return (
    <Tr>
      <Td>
        <Text>5:00pm - 7:00pm (2 hrs)</Text>
      </Td>
      <Td>
        {!volunteer && !userId ? (
          <Text color="text.gray">No volunteers</Text>
        ) : (
          <Text>{volunteer}</Text>
        )}
      </Td>
      <Td textAlign="right">
        {volunteer && userId && (
          <Button color="text.critical" variant="none">
            Remove
          </Button>
        )}
      </Td>
    </Tr>
  );
};

export default AdminScheduleTableRow;

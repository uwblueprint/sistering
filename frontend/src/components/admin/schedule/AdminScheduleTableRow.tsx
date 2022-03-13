import { Button, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";
import { getElapsedHours, getTime } from "../../../utils/DateTimeUtils";

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
  const elapsedHours =
    postingStart && postingEnd ? getElapsedHours(postingStart, postingEnd) : 0;

  // No shifts available
  return postingStart && postingEnd ? (
    <Tr>
      <Td>
        <Text>
          {getTime(postingStart)} - {getTime(postingEnd)} ({elapsedHours}{" "}
          {elapsedHours > 1 ? "hrs" : "hr"})
        </Text>
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
  ) : (
    <Tr>
      <Td colSpan={3}>
        <Text color="text.gray">No shifts available</Text>
      </Td>
    </Tr>
  );
};

export default AdminScheduleTableRow;

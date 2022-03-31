import { Button, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";
import { getElapsedHours, getTime } from "../../../utils/DateTimeUtils";

type AdminScheduleTableRowProps = {
  volunteer?: { name: string; userId: string };
  postingStart?: Date;
  postingEnd?: Date;
};

const AdminScheduleTableRow = ({
  volunteer,
  postingStart,
  postingEnd,
}: AdminScheduleTableRowProps): React.ReactElement => {
  const elapsedHours =
    postingStart && postingEnd ? getElapsedHours(postingStart, postingEnd) : 0;

  // No shifts available
  if (postingStart && postingEnd) {
    return (
      <Tr h="74px">
        <Td>
          <Text>
            {getTime(postingStart)} - {getTime(postingEnd)} ({elapsedHours}{" "}
            {elapsedHours > 1 ? "hrs" : "hr"})
          </Text>
        </Td>
        <Td>
          {!volunteer ? (
            <Text color="text.gray">No volunteers</Text>
          ) : (
            <Text>{volunteer.name}</Text>
          )}
        </Td>
        <Td textAlign="right">
          {volunteer && (
            <Button color="text.critical" variant="none" size="sm">
              Remove
            </Button>
          )}
        </Td>
      </Tr>
    );
  }
  return (
    <Tr h="74px">
      <Td colSpan={3}>
        <Text color="text.gray">No shifts available</Text>
      </Td>
    </Tr>
  );
};

export default AdminScheduleTableRow;

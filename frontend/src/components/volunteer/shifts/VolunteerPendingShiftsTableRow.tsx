import React from "react";
import { Tr, Td, Text, Button, Table, Tbody } from "@chakra-ui/react";
import { generatePath, useHistory } from "react-router-dom";

import { formatDateMonthDay } from "../../../utils/DateTimeUtils";
import { VOLUNTEER_POSTING_DETAILS } from "../../../constants/Routes";

type VolunteerShiftsTableRowProps = {
  postingName: string;
  postingId: string;
  deadline: string;
};

const VolunteerShiftsTableRow: React.FC<VolunteerShiftsTableRowProps> = ({
  postingName,
  postingId,
  deadline,
}: VolunteerShiftsTableRowProps) => {
  const history = useHistory();

  return (
    <Table variant="brand">
      <Tbody>
        <Tr>
          <Td>
            <Text>{postingName}</Text>
          </Td>
          <Td>
            <Text>Deadline: {formatDateMonthDay(deadline)}</Text>
          </Td>
          <Td>
            <Button
              variant="link"
              onClick={() =>
                history.push(
                  generatePath(VOLUNTEER_POSTING_DETAILS, { id: postingId }),
                )
              }
            >
              Go To Posting
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default VolunteerShiftsTableRow;

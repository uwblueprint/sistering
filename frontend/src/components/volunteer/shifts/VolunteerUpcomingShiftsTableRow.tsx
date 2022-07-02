import React from "react";
import { Tr, Td, Text, Button } from "@chakra-ui/react";
import { generatePath, useHistory } from "react-router-dom";

import {
  getElapsedHours,
  formatTimeHourMinutes,
} from "../../../utils/DateTimeUtils";
import { VOLUNTEER_POSTING_DETAILS } from "../../../constants/Routes";

type VolunteerUpcomingShiftsTableRowProps = {
  postingName: string;
  postingId: string;
  startTime: string;
  endTime: string;
};

const VolunteerUpcomingShiftsTableRow: React.FC<VolunteerUpcomingShiftsTableRowProps> = ({
  postingName,
  postingId,
  startTime,
  endTime,
}: VolunteerUpcomingShiftsTableRowProps) => {
  const history = useHistory();

  const start = new Date(startTime);
  const end = new Date(endTime);
  const startString = formatTimeHourMinutes(start);
  const endString = formatTimeHourMinutes(end);

  const time = `${startString} - ${endString}`;
  const elaspedHours = getElapsedHours(start, end);
  const duration =
    elaspedHours > 1 ? `(${elaspedHours} hrs)` : `(${elaspedHours} hr)`;

  return (
    <Tr>
      <Td>
        <Text>{`${time} ${duration}`}</Text>
      </Td>
      <Td>
        <Text>{postingName}</Text>
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
  );
};

export default VolunteerUpcomingShiftsTableRow;

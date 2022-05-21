import React from "react";
import { Tr, Td, Text, Button } from "@chakra-ui/react";
import { generatePath, useHistory } from "react-router-dom";

import {
  getElapsedHours,
  formatTimeHourMinutes,
  formatDateMonthDay,
} from "../../../utils/DateTimeUtils";
import { ShiftSignupStatus } from "../../../types/api/ShiftSignupTypes";
import { VOLUNTEER_POSTING_DETAILS } from "../../../constants/Routes";

type VolunteerShiftsTableRowProps = {
  postingName: string;
  postingId: string;
  startTime: string;
  endTime: string;
  deadline: string;
  status: ShiftSignupStatus;
};
const VolunteerShiftsTableRow: React.FC<VolunteerShiftsTableRowProps> = ({
  postingName,
  postingId,
  startTime,
  endTime,
  deadline,
  status,
}: VolunteerShiftsTableRowProps) => {
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
      {/* eslint-disable-next-line no-nested-ternary */}
      {status === "PUBLISHED" ? (
        <>
          <Td>
            <Text>{`${time} ${duration}`}</Text>
          </Td>
          <Td>
            <Text>{postingName}</Text>
          </Td>
        </>
      ) : status === "CONFIRMED" || status === "PENDING" ? (
        <>
          <Td>
            <Text>{postingName}</Text>
          </Td>
          <Td>
            <Text>Deadline: {formatDateMonthDay(deadline)}</Text>
          </Td>
        </>
      ) : null}
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

export default VolunteerShiftsTableRow;

import React from "react";
<<<<<<< HEAD
import { Tr, Td, Text, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

=======
import { Tr, Td, Text, Link } from "@chakra-ui/react";
>>>>>>> Update UI and date formatting to use momentJS
import {
  getElapsedHours,
  formatTimeHourMinutes,
  formatDateMonthDay,
} from "../../../utils/DateTimeUtils";
import { ShiftSignupStatus } from "../../../types/api/ShiftSignupTypes";

type VolunteerShiftsTableRowProps = {
  postingName: string;
  postingLink: string;
  startTime: string;
  endTime: string;
  deadline: string;
  status: ShiftSignupStatus;
};
const VolunteerShiftsTableRow: React.FC<VolunteerShiftsTableRowProps> = ({
  postingName,
  postingLink,
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
      {status === "CONFIRMED" || status === "PENDING" ? (
        <>
          <Td>
            <Text>{`${time} ${duration}`}</Text>
          </Td>
          <Td>
            <Text>{postingName}</Text>
          </Td>
        </>
      ) : status === "PUBLISHED" ? (
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
        <Button variant="link" onClick={() => history.push(postingLink)}>
          Go To Posting
        </Button>
      </Td>
    </Tr>
  );
};

export default VolunteerShiftsTableRow;

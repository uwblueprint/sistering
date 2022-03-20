import React from "react";
import { Tr, Td, Text, Link } from "@chakra-ui/react";
import {
  getElapsedHours,
  formatTimeHourMinutes,
  formatDateMonthDay,
} from "../../../utils/DateTimeUtils";

type VolunteerShiftsTableRowProps = {
  postingName: string;
  postingLink: string;
  startTime?: string;
  endTime?: string;
  deadline?: string;
};
const VolunteerShiftsTableRow: React.FC<VolunteerShiftsTableRowProps> = ({
  postingName,
  postingLink,
  startTime,
  endTime,
  deadline,
}: VolunteerShiftsTableRowProps) => {
  let duration;
  let time;
  if (endTime && startTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startString = formatTimeHourMinutes(start);
    const endString = formatTimeHourMinutes(end);

    time = `${startString} - ${endString}`;
    const elaspedHours = getElapsedHours(start, end);
    duration =
      elaspedHours > 1 ? ` (${elaspedHours} hrs)` : `(${elaspedHours} hr)`;
  }

  return (
    <Tr>
      {duration && time && (
        <Td>
          <Text>{time + duration}</Text>
        </Td>
      )}
      <Td>
        <Text>{postingName}</Text>
      </Td>
      {deadline && (
        <Td>
          <Text>Deadline: {formatDateMonthDay(deadline)}</Text>
        </Td>
      )}
      <Td>
        <Link href={postingLink}>Go To Posting</Link>
      </Td>
    </Tr>
  );
};

export default VolunteerShiftsTableRow;

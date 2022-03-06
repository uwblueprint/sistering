import React from "react";
import { Tr, Td, Text, Button as ChakraButton, Link } from "@chakra-ui/react";

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
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    let durationMins = (endDate.getTime() - startDate.getTime()) / 60000;
    console.log("duration", duration);
    const hours = durationMins / 60;
    console.log("duration mins", durationMins);

    durationMins %= 60;

    duration = `(${hours} ${hours > 1 ? "hrs" : "hr"}`;
    duration += durationMins > 0 ? `${durationMins} mins)` : ")";

    const options = { hour: "numeric", minute: "numeric", hour12: true };
    // new Date(endTime).toISOString() - new Date(startTime).toISOString();
    time =
      startDate.toLocaleTimeString(
        "en-CA",
        options as Intl.DateTimeFormatOptions,
      ) +
      endDate.toLocaleTimeString(
        "en-CA",
        options as Intl.DateTimeFormatOptions,
      );
  }

  let formattedDeadline;
  if (deadline) {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const date = new Date(deadline);
    formattedDeadline = date.toLocaleDateString(
      "en-CA",
      options as Intl.DateTimeFormatOptions,
    );
  }

  return (
    <Tr>
      {time && (
        <Td>
          <Text textStyle="body-regular">{time + duration}</Text>
        </Td>
      )}
      <Td>
        <Text textStyle="body-regular">{postingName}</Text>
      </Td>
      {deadline && (
        <Td>
          <Text textStyle="body-regular">Deadline: {formattedDeadline}</Text>
        </Td>
      )}
      <Td>
        <Link href={postingLink}>Go To Posting</Link>
      </Td>
    </Tr>
  );
};

export default VolunteerShiftsTableRow;

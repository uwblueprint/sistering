import { Text, Th, Tr } from "@chakra-ui/react";
import React from "react";
import { formatDateStringYear } from "../../../utils/DateTimeUtils";

type VolunteerShiftsTableDateProps = {
  date: Date;
};

const VolunteerShiftsTableDate = ({
  date,
}: VolunteerShiftsTableDateProps): React.ReactElement => {
  return (
    <Tr>
      <Th colSpan={3}>
        <Text>{formatDateStringYear(date.toUTCString())}</Text>
      </Th>
    </Tr>
  );
};

export default VolunteerShiftsTableDate;

import { Text, Th, Tr } from "@chakra-ui/react";
import React from "react";
import { formatDateStringYear } from "../../../utils/DateTimeUtils";

type AdminScheduleTableDateProps = {
  date: Date;
};

const AdminScheduleTableDate = ({
  date,
}: AdminScheduleTableDateProps): React.ReactElement => {
  return (
    <Tr>
      <Th colSpan={3}>
        <Text>{formatDateStringYear(date.toUTCString())}</Text>
      </Th>
    </Tr>
  );
};

export default AdminScheduleTableDate;

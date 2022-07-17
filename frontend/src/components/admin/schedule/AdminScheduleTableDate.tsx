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
      <Th
        colSpan={3}
        bg="background.light"
        _first={{ borderTop: "2px", borderColor: "background.dark" }}
      >
        <Text textStyle="body-regular" fontWeight="bold">
          {formatDateStringYear(date.toUTCString())}
        </Text>
      </Th>
    </Tr>
  );
};

export default AdminScheduleTableDate;

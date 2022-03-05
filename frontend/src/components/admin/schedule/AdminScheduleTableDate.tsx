import { Text, Th, Tr } from "@chakra-ui/react";
import React from "react";

type AdminScheduleTableDateProps = {
  date: Date;
};

const AdminScheduleTableDate = ({
  date,
}: AdminScheduleTableDateProps): React.ReactElement => {
  return (
    <Tr>
      <Th>
        <Text>{date.toDateString()}</Text>
      </Th>
    </Tr>
  );
};

export default AdminScheduleTableDate;

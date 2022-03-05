import { Table, Tbody } from "@chakra-ui/react";
import React from "react";
import AdminScheduleTableDate from "./AdminScheduleTableDate";
import AdminScheduleTableRow from "./AdminScheduleTableRow";

const AdminScheduleTable = (): React.ReactElement => {
  return (
    <Table variant="brand">
      <Tbody>
        <AdminScheduleTableDate date={new Date("2020-01-01")} />
        <AdminScheduleTableRow />
        <AdminScheduleTableRow />
        <AdminScheduleTableRow />
        <AdminScheduleTableRow
          postingStart={new Date("2020-01-01 13:00:00")}
          postingEnd={new Date("2020-01-01 15:00:00")}
        />
        <AdminScheduleTableRow
          volunteer="Lambert Liu"
          postingStart={new Date("2020-01-01 13:00:00")}
          postingEnd={new Date("2020-01-01 15:00:00")}
        />
      </Tbody>
    </Table>
  );
};

export default AdminScheduleTable;

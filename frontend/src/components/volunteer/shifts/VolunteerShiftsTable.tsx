import React, { Fragment } from "react";
import {
  Container,
  Table,
  Text,
  VStack,
  Button as ChakraButton,
} from "@chakra-ui/react";
import VolunteerShiftsTableRow from "./VolunteerShiftsTableRow";
import VolunteerShiftsTableDate from "./VolunteerShiftsTableDate";

type Shift = {
  startTime?: string;
  endTime?: string;
  postingName: string;
  postingLink: string;
  deadline?: string;
};

type VolunteerDateShifts = {
  date: Date;
  shifts: Shift[];
};

type VolunteerShiftsTableProps = {
  shifts: VolunteerDateShifts[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  shifts.sort((a: VolunteerDateShifts, b: VolunteerDateShifts) =>
    a.date <= b.date ? -1 : 1,
  );

  if (!shifts.length) {
    return (
      <Container maxW="container.xl" minH="90vh">
        <VStack pt="25%">
          <Text color="text.gray">No shifts to show</Text>
          <ChakraButton variant="outline">
            Browse volunteer postings
          </ChakraButton>
        </VStack>
      </Container>
    );
  }

  return (
    <Table variant="brand">
      {shifts.map((day) => (
        <Fragment key={day.date.toDateString()}>
          <VolunteerShiftsTableDate date={day.date} />
          {day.shifts.length > 0
            ? day.shifts.map((shift: Shift, idx) => (
                <VolunteerShiftsTableRow
                  key={idx}
                  postingName={shift.postingName}
                  postingLink={shift.postingLink}
                  startTime={shift.startTime}
                  endTime={shift.endTime}
                  deadline={shift.deadline}
                />
              ))
            : null}
        </Fragment>
      ))}
    </Table>
  );
};

export default VolunteerShiftsTable;

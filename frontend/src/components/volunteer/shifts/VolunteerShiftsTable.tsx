import React from "react";
import {
  Container,
  Table,
  Text,
  Flex,
  Stack,
  Button as ChakraButton,
} from "@chakra-ui/react";
import VolunteerShiftsTableRow from "./VolunteerShiftsTableRow";

const mockTableData = [
  {
    name: "Posting Name",
    link: "/",
    startTime: "2022-01-21T03:00:00+00:00",
    endTime: "2022-01-21T05:00:00+00:00",
  },
  {
    name: "Posting Name",
    link: "/",
    deadline: "Friday, February 17",
  },
];

const upcomingShift = {
  name: "Posting Name",
  link: "/",
  startTime: "2022-01-21T03:00:00+00:00",
  endTime: "2022-01-21T05:00:00+00:00",
};

const pendingShift = {
  name: "Posting Name",
  link: "/",
  deadline: "Friday, February 17",
};

type Shift = {
  startTime: string;
  endTime: string;
  postingName?: string;
  postingLink?: string;
  deadline?: string;
};
type VolunteerShiftsTableProps = {
  shifts: Shift[];
};

const VolunteerShiftsTable: React.FC<VolunteerShiftsTableProps> = ({
  shifts,
}: VolunteerShiftsTableProps) => {
  shifts.sort((a: Shift, b: Shift) => (a.startTime <= b.startTime ? -1 : 1));

  // if (!shifts.length) {
  //   return (
  //     <Container maxW="container.xl" minH="90vh">
  //       <Flex p={10} justifyContent="center">
  //         <Stack p={10}>
  //           <Text textStyle="body-regular" color="text.gray" align="center">
  //             No shifts to show
  //           </Text>
  //           <ChakraButton variant="outline">
  //             Browse volunteer postings
  //           </ChakraButton>
  //         </Stack>
  //       </Flex>
  //     </Container>
  //   );
  // }

  return (
    <Container maxW="container.xl" minH="90vh">
      <Table maxW="1238px" colorScheme="gray">
        <VolunteerShiftsTableRow
          postingName={upcomingShift.name}
          postingLink={upcomingShift.link}
          startTime={upcomingShift.startTime}
          endTime={upcomingShift.endTime}
        />
        <VolunteerShiftsTableRow
          postingName={pendingShift.name}
          postingLink={pendingShift.link}
          deadline={pendingShift.deadline}
        />
      </Table>
    </Container>
  );
};

export default VolunteerShiftsTable;

import React from "react";
import { Container, Divider } from "@chakra-ui/react";
import ShiftCalendar from "../../../admin/ShiftCalendar/ShiftCalendar";

const CreatePostingShiftsPage = (): React.ReactElement => {
  return (
    <Container maxW="container.lg">
      <ShiftCalendar />
      <Divider my={4} />
    </Container>
  );
};

export default CreatePostingShiftsPage;

import {
  Button,
  Container,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { VOLUNTEER_POSTINGS_PAGE } from "../../../constants/Routes";

const VolunteerShiftsTableEmptyState = (): React.ReactElement => {
  const history = useHistory();
  return (
    <Table variant="brand">
      <Tbody>
        <Tr>
          <Td>
            <Container maxW="container.xl" minH="90vh">
              <VStack pt="25%">
                <Text color="text.gray">No shifts to show</Text>
                <Button
                  variant="outline"
                  onClick={() => history.push(VOLUNTEER_POSTINGS_PAGE)}
                >
                  Browse volunteer postings
                </Button>
              </VStack>
            </Container>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default VolunteerShiftsTableEmptyState;

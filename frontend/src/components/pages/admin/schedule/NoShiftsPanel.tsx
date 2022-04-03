import React from "react";
import { Center, Text } from "@chakra-ui/react";
import { ADMIN_SCHEDULE_NO_SHIFTS } from "../../../../constants/Copy";

const NoShiftsPanel = (): React.ReactElement => {
  return (
    <Center h="full" borderLeft="2px" borderColor="background.dark" px="100px">
      <Text textStyle="heading" color="text.gray">
        {ADMIN_SCHEDULE_NO_SHIFTS}
      </Text>
    </Center>
  );
};

export default NoShiftsPanel;

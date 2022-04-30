import React from "react";
import { useHistory } from "react-router-dom";

import { Flex, Box, Tag, Button } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const AdminSchedulePageHeader = ({
  branchName,
}: {
  branchName: string;
}): React.ReactElement => {
  const history = useHistory();
  return (
    <Box px="40px" borderBottom="2px" borderColor="background.dark" py="7px">
      <Flex h="50px" alignItems="center" justifyContent="space-between">
        <Button
          leftIcon={<ChevronLeftIcon w={8} h={8} />}
          variant="link"
          onClick={() => history.push("/")}
        >
          Back to homepage
        </Button>
        <Tag mr={3}>{branchName}</Tag>
      </Flex>
    </Box>
  );
};

export default AdminSchedulePageHeader;

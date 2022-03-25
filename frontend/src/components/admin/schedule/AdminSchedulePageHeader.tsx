import React from "react";
import { Link } from "react-router-dom";

import { Flex, Box, Tag, Button } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const AdminSchedulePageHeader = ({
  branchName,
}: {
  branchName: string;
}): React.ReactElement => {
  return (
    <Box
      px="40px"
      borderBottom="2px"
      borderRight="2px"
      borderColor="background.dark"
    >
      <Flex h="50px" alignItems="center" justifyContent="space-between">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button leftIcon={<ChevronLeftIcon w={8} h={8} />} variant="link">
            Back to homepage
          </Button>
        </Link>
        <Tag mr={3}>{branchName}</Tag>
      </Flex>
    </Box>
  );
};

export default AdminSchedulePageHeader;

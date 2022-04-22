import { Button, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

type AdminPostingScheduleHeaderProps = {
  postingName: string;
  postingID: number;
};

const AdminPostingScheduleHeader = ({
  postingName,
  postingID,
}: AdminPostingScheduleHeaderProps): React.ReactElement => {
  const history = useHistory();

  return (
    <VStack spacing="15px">
      <Flex
        dir="horizontal"
        justifyContent="space-between"
        alignItems="center"
        mx="47px"
        width="100%"
      >
        <Text textStyle="display-small-semibold">{postingName}</Text>
        <Flex dir="horizontal">
          <Button
            variant="ghost"
            textStyle="button-semibold"
            mr="26px"
            onClick={() => history.push(`/admin/posting/${postingID}`)}
          >
            View Posting
          </Button>
          <Button
            textStyle="button-semibold"
            onClick={() =>
              history.push(`admin/schedule/posting/${postingID}/review`)
            }
          >
            Review
          </Button>
        </Flex>
      </Flex>
      <Divider />
    </VStack>
  );
};

export default AdminPostingScheduleHeader;

import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

type AdminPostingScheduleHeaderProps = {
  postingName: string;
  postingID: number;
  onReviewClick: () => void;
};

const AdminPostingScheduleHeader = ({
  postingName,
  postingID,
  onReviewClick,
}: AdminPostingScheduleHeaderProps): React.ReactElement => {
  const history = useHistory();

  return (
    <VStack
      py="15px"
      mx="47px"
      borderBottomWidth="2px"
      borderBottomColor="background.dark"
    >
      <Flex
        dir="horizontal"
        justifyContent="space-between"
        alignItems="center"
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
          <Button textStyle="button-semibold" onClick={onReviewClick}>
            Review
          </Button>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default AdminPostingScheduleHeader;
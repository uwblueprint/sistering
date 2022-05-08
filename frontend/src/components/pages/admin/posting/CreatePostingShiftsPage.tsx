import React from "react";
import { useHistory } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";

import CreatePostingShifts from "../../../admin/posting/CreatePostingShifts";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";
import {
  ADMIN_POSTING_CREATE_BASIC_INFO_PAGE,
  ADMIN_POSTING_CREATE_REVIEW_PAGE,
} from "../../../../constants/Routes";

const CreatePostingShiftsPage = (): React.ReactElement => {
  const history = useHistory();
  const navigateBack = () => history.push(ADMIN_POSTING_CREATE_BASIC_INFO_PAGE);
  const navigateToNext = () => history.push(ADMIN_POSTING_CREATE_REVIEW_PAGE);
  return (
    <Box>
      <HStack alignItems="flex-start" spacing={0}>
        <SideNavBarWithTitle
          title="Create New Posting"
          labels={["Basic Information", "Time Slots", "Review and Post"]}
          activeStep={1}
        />
        <CreatePostingShifts
          navigateBack={navigateBack}
          navigateToNext={navigateToNext}
        />
      </HStack>
    </Box>
  );
};

export default CreatePostingShiftsPage;

import React from "react";
import { useHistory } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";

import CreatePostingBasicInfo from "../../../admin/posting/CreatePostingBasicInfo";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";
import { ADMIN_POSTING_CREATE_SHIFTS_PAGE } from "../../../../constants/Routes";

const CreatePostingBasicInfoPage = (): React.ReactElement => {
  const history = useHistory();
  const navigateToNext = () => history.push(ADMIN_POSTING_CREATE_SHIFTS_PAGE);
  return (
    <Box>
      <HStack alignItems="flex-start" spacing={0}>
        <SideNavBarWithTitle
          title="Create New Posting"
          labels={["Basic Information", "Time Slots", "Review and Post"]}
          activeStep={0}
        />
        <CreatePostingBasicInfo navigateToNext={navigateToNext} />
      </HStack>
    </Box>
  );
};

export default CreatePostingBasicInfoPage;

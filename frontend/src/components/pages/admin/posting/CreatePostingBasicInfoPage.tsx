import React from "react";
import { Box, HStack } from "@chakra-ui/react";

import CreatePostingBasicInfo from "../../../admin/posting/CreatePostingBasicInfo";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";

type CreatePostingPageProps = {
  navigateToNext: () => void;
};

const CreatePostingBasicInfoPage = ({
  navigateToNext,
}: CreatePostingPageProps): React.ReactElement => {
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

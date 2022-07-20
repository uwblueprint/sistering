import React from "react";
import { Box, HStack } from "@chakra-ui/react";

import PostingFormBasicInfo from "../../../admin/posting/PostingFormBasicInfo";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";

type PostingFormPageProps = {
  navigateToNext: () => void;
  steps: string[];
};

const PostingFormBasicInfoPage = ({
  navigateToNext,
  steps,
}: PostingFormPageProps): React.ReactElement => {
  return (
    <Box>
      <HStack alignItems="flex-start" spacing={0}>
        <SideNavBarWithTitle
          title="Create New Posting"
          labels={steps}
          activeStep={0}
        />
        <PostingFormBasicInfo navigateToNext={navigateToNext} />
      </HStack>
    </Box>
  );
};

export default PostingFormBasicInfoPage;

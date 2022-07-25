import React from "react";
import { Box, HStack } from "@chakra-ui/react";

import PostingFormShifts from "../../../admin/posting/PostingFormShifts";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";

type PostingFormPageProps = {
  navigateToNext: () => void;
  navigateBack: () => void;
  steps: string[];
  title: string;
};

const PostingFormShiftsPage = ({
  navigateToNext,
  navigateBack,
  steps,
  title,
}: PostingFormPageProps): React.ReactElement => {
  return (
    <Box>
      <HStack alignItems="flex-start" spacing={0}>
        <SideNavBarWithTitle title={title} labels={steps} activeStep={1} />
        <PostingFormShifts
          navigateBack={navigateBack}
          navigateToNext={navigateToNext}
        />
      </HStack>
    </Box>
  );
};

export default PostingFormShiftsPage;

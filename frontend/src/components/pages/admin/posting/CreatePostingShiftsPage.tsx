import React from "react";
import { Box, HStack } from "@chakra-ui/react";

import CreatePostingShifts from "../../../admin/posting/CreatePostingShifts";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";

type CreatePostingPageProps = {
  navigateToNext: () => void;
  navigateBack: () => void;
};

const CreatePostingShiftsPage = ({
  navigateToNext,
  navigateBack,
}: CreatePostingPageProps): React.ReactElement => {
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

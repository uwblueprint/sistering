import React from "react";
import { useHistory } from "react-router-dom";
import { Container, HStack, Text, VStack } from "@chakra-ui/react";

import CreatePostingBasicInfo from "../../../admin/posting/CreatePostingBasicInfo";
import SideNavBar from "../../../common/SideNavbar";
import { ADMIN_POSTING_CREATE_SHIFTS_PAGE } from "../../../../constants/Routes";

const CreatePostingBasicInfoPage = (): React.ReactElement => {
  const history = useHistory();
  const navigateToNext = () => history.push(ADMIN_POSTING_CREATE_SHIFTS_PAGE);
  return (
    <Container maxW="container.xl" p={0}>
      <HStack alignItems="flex-start" spacing={0}>
        <VStack alignItems="flex-start" spacing="90px">
          <Text textStyle="display-medium" pt={10}>
            Create New Posting
          </Text>
          <SideNavBar
            activeStep={0}
            labels={["Basic Information", "Time Slots", "Review and Post"]}
          />
        </VStack>
        <CreatePostingBasicInfo navigateToNext={navigateToNext} />
      </HStack>
    </Container>
  );
};

export default CreatePostingBasicInfoPage;

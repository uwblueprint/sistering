import React from "react";
import { Container } from "@chakra-ui/react";

import CreatePostingReview from "../../../admin/posting/CreatePostingReview";

const CreatePostingReviewPage = (): React.ReactElement => {
  return (
    <Container border="1px" maxW="container.xl" p={0}>
      <CreatePostingReview />
    </Container>
  );
};

export default CreatePostingReviewPage;

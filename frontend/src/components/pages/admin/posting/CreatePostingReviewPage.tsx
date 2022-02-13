import React from "react";

import CreatePostingReview from "../../../admin/posting/CreatePostingReview";
import MainPageButton from "../../../common/MainPageButton";

const CreatePostingReviewPage = (): React.ReactElement => {
  return (
    <div>
      <CreatePostingReview />
      <MainPageButton />
    </div>
  );
};

export default CreatePostingReviewPage;

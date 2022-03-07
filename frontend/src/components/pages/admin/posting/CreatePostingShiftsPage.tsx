import React from "react";
import { useHistory } from "react-router-dom";

import CreatePostingShifts from "../../../admin/posting/CreatePostingShifts";
import { ADMIN_POSTING_CREATE_REVIEW_PAGE } from "../../../../constants/Routes";

const CreatePostingShiftsPage = (): React.ReactElement => {
  const history = useHistory();
  const navigateToNext = () => history.push(ADMIN_POSTING_CREATE_REVIEW_PAGE);
  return <CreatePostingShifts navigateToNext={navigateToNext} />;
};

export default CreatePostingShiftsPage;

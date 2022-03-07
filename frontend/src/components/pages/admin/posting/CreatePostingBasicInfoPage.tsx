import React from "react";
import { useHistory } from "react-router-dom";

import CreatePostingBasicInfo from "../../../admin/posting/CreatePostingBasicInfo";
import { ADMIN_POSTING_CREATE_SHIFTS_PAGE } from "../../../../constants/Routes";

const CreatePostingBasicInfoPage = (): React.ReactElement => {
  const history = useHistory();
  const navigateToNext = () => history.push(ADMIN_POSTING_CREATE_SHIFTS_PAGE);
  return <CreatePostingBasicInfo navigateToNext={navigateToNext} />;
};

export default CreatePostingBasicInfoPage;

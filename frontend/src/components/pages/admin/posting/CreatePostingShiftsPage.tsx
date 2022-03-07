import React from "react";
import { useHistory } from "react-router-dom";
import { Divider } from "@chakra-ui/react";

import CreatePostingShifts from "../../../admin/posting/CreatePostingShifts";
import MainPageButton from "../../../common/MainPageButton";
import { ADMIN_POSTING_CREATE_REVIEW_PAGE } from "../../../../constants/Routes";

const CreatePostingShiftsPage = (): React.ReactElement => {
  const history = useHistory();
  const navigateToNext = () => history.push(ADMIN_POSTING_CREATE_REVIEW_PAGE);
  return (
    <div>
      <CreatePostingShifts navigateToNext={navigateToNext} />
      <Divider my={4} />
      <MainPageButton />
    </div>
  );
};

export default CreatePostingShiftsPage;

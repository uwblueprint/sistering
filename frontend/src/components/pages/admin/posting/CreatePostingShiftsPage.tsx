import React from "react";
import { Divider } from "@chakra-ui/react";

import CreatePostingShifts from "../../../admin/posting/CreatePostingShifts";
import MainPageButton from "../../../common/MainPageButton";

const CreatePostingShiftsPage = (): React.ReactElement => {
  return (
    <div>
      <CreatePostingShifts />
      <Divider my={4} />
      <MainPageButton />
    </div>
  );
};

export default CreatePostingShiftsPage;

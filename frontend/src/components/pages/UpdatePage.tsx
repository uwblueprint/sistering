import React from "react";
import { Box } from "@chakra-ui/react";

import UpdateForm from "../crud/UpdateForm";
import MainPageButton from "../common/MainPageButton";

const UpdatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <Box textStyle="display-large">Default Page</Box>
      <MainPageButton />
      <UpdateForm />
    </div>
  );
};

export default UpdatePage;

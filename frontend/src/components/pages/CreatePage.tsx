import React from "react";
import { Box } from "@chakra-ui/react";

import CreateForm from "../crud/CreateForm";
import MainPageButton from "../common/MainPageButton";

const CreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <Box textStyle="display-large">Default Page</Box>
      <MainPageButton />
      <CreateForm />
    </div>
  );
};

export default CreatePage;

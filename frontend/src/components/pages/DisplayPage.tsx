import React from "react";
import { Box } from "@chakra-ui/react";

import DisplayTableContainer from "../crud/DisplayTableContainer";
import MainPageButton from "../common/MainPageButton";

const GetPage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <Box textStyle="display-large">Default Page</Box>
      <MainPageButton />
      <DisplayTableContainer />
    </div>
  );
};

export default GetPage;

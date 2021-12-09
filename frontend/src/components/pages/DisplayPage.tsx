import React from "react";
import { Text } from "@chakra-ui/react";

import DisplayTableContainer from "../crud/DisplayTableContainer";
import MainPageButton from "../common/MainPageButton";

const GetPage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <Text textStyle="display-large">Default Page</Text>
      <MainPageButton />
      <DisplayTableContainer />
    </div>
  );
};

export default GetPage;

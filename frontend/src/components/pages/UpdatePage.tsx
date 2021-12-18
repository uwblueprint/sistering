import React from "react";
import { Text } from "@chakra-ui/react";

import UpdateForm from "../crud/UpdateForm";
import MainPageButton from "../common/MainPageButton";

const UpdatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <Text textStyle="display-large">Default Page</Text>
      <MainPageButton />
      <UpdateForm />
    </div>
  );
};

export default UpdatePage;

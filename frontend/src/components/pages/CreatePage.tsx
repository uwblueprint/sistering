import React from "react";
import { Text } from "@chakra-ui/react";

import CreateForm from "../crud/CreateForm";
import MainPageButton from "../common/MainPageButton";

const CreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <Text textStyle="display-large">Default Page</Text>
      <MainPageButton />
      <CreateForm />
    </div>
  );
};

export default CreatePage;

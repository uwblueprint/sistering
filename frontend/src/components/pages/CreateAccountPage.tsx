import React from "react";
import { Text, Button, Box } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../assets/Sistering_Logo.svg";

const CreateAccountPage = (): React.ReactElement => {
  const onContinue = () => {
    //
  };

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <Box
        style={{
          backgroundColor: "#fff",
          flexGrow: 4,
        }}
      >
        <Box style={{ maxWidth: "400px", margin: "8vh auto 0 auto" }}>
          <Logo />
          <Box style={{ paddingLeft: "43px" }}>
            <Text
              fontSize="xl"
              style={{ fontWeight: "bold", marginBottom: "12px" }}
            >
              Welcome to Sistering!
            </Text>
            <Text style={{ marginBottom: "24px" }}>
              Please follow the steps to activate your sistering account. We
              look forward to working with you.
            </Text>
            <Button style={{ color: "#7000DE", width: "100%" }}>
              <Text style={{ color: "#fff" }}>Continue</Text>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box style={{ backgroundColor: "#f4f4f4", flexGrow: 6 }}> </Box>
    </Box>
  );
};

export default CreateAccountPage;

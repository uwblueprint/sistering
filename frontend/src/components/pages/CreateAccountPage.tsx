import React from "react";
import { Text, Button } from "@chakra-ui/react";
import { ReactComponent as Logo } from "../../assets/Sistering_Logo.svg";

const CreateAccountPage = (): React.ReactElement => {
  const onContinue = () => {
    //
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          flexGrow: 4,
        }}
      >
        <div style={{ maxWidth: "400px", margin: "8vh auto 0 auto" }}>
          <Logo />
          <div style={{ paddingLeft: "43px" }}>
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
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#f4f4f4", flexGrow: 6 }}> </div>
    </div>
  );
};

export default CreateAccountPage;

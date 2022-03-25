import React from "react";
import { Step, Steps } from "chakra-ui-steps";
import { Text, VStack } from "@chakra-ui/react";

export interface SideNavbarStepsType {
  activeStep: number;
  labels: string[];
}

const createStepLabel = (
  idx: number,
  activeStep: number,
  label: string,
): React.ReactNode => (
  <VStack
    marginLeft="20px"
    spacing="-2px"
    alignItems="left"
    justifyContent="center"
  >
    <Text
      opacity={1}
      marginTop="-8px"
      fontFamily="Raleway"
      fontSize="12px"
      textAlign="left"
      color="#8B8B8B"
    >
      STEP {idx + 1}
    </Text>
    <Text
      opacity={1}
      fontFamily="Raleway"
      fontSize="20px"
      fontWeight={activeStep === idx ? "bold" : "normal"}
      textAlign="left"
    >
      {label}
    </Text>
  </VStack>
);

const SideNavbar = (steps: SideNavbarStepsType): React.ReactElement => {
  const { activeStep, labels } = steps;
  return (
    // TODO: remove hardcoded width, investigate text wrapping behaviour
    <Steps activeStep={activeStep} orientation="vertical" width="250px">
      {labels.map((label, idx) => (
        <Step label={createStepLabel(idx, activeStep, label)} key={idx} />
      ))}
    </Steps>
  );
};

export default SideNavbar;

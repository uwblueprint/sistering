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
      fontFamily="raleway"
      fontSize="12px"
      textAlign="left"
      color="#8B8B8B"
    >
      STEP {idx + 1}
    </Text>
    <Text
      opacity={1}
      fontFamily="raleway"
      fontSize="20px"
      fontWeight={activeStep === idx ? "bold" : "normal"}
    >
      {label}
    </Text>
  </VStack>
);

const SideNavbar = (steps: SideNavbarStepsType): React.ReactElement => {
  const { activeStep, labels } = steps;
  return (
    <Steps activeStep={activeStep} orientation="vertical">
      {labels.map((label, idx) => (
        <Step label={createStepLabel(idx, activeStep, label)} key={idx} />
      ))}
    </Steps>
  );
};

export default SideNavbar;

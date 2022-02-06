import React from "react";
import { Step, Steps, useSteps } from "chakra-ui-steps";

import { Button, Flex, Text, VStack } from "@chakra-ui/react";

const stepLabel = (key: string) => (
  <VStack spacing="-4px" alignItems="left">
    <Text variant="subheading" fontSize="12px" textAlign="left" color="#8B8B8B">
      {key.toUpperCase()}
    </Text>
    <Text variant="heading" fontWeight="normal">
      Basic Information
    </Text>
  </VStack>
);

const steps = [
  { heading: "Step 1", label: stepLabel("Step 1"), content: null },
  { heading: "Step 2", label: stepLabel("Step 2"), content: null },
  { heading: "Step 3", label: stepLabel("Step 3"), content: null },
];

const SideNavbarDemo = (): React.ReactElement => {
  const { activeStep, prevStep, nextStep } = useSteps({
    initialStep: 0,
  });

  return (
    <Flex
      flexDir="column"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#F3F3F3"
    >
      <Flex flexDir="column">
        <Steps activeStep={activeStep} orientation="vertical">
          {steps.map(({ heading, label, content }) => (
            <Step label={label} key={heading}>
              {content}
            </Step>
          ))}
        </Steps>
        <Flex flexDir="row" justifyContent="center" mt={5}>
          <Button mr={2} onClick={prevStep} bg="violet" color="white" >
            Prev
          </Button>
          <Button onClick={nextStep} bg="violet" color="white">
            Next
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SideNavbarDemo;

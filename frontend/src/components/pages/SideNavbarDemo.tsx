import React from "react";
import { useSteps } from "chakra-ui-steps";

import { Button, Flex } from "@chakra-ui/react";
import SideNavbar from "../common/SideNavbar";

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
      <Flex flexDir="column" width="250px">
        <SideNavbar
          activeStep={activeStep}
          labels={["Basic Information", "Time Slots", "Review and Post"]}
        />
        <Flex flexDir="row" justifyContent="center" mt={5}>
          <Button mr={2} onClick={prevStep} bg="violet" color="white">
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

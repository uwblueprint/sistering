import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import SideNavBar from "./SideNavbar";

type SideNavbarWithTitleProps = {
  title: string;
  labels: string[];
  activeStep: number;
};

const SideNavbarWithTitle: React.FC<SideNavbarWithTitleProps> = ({
  title,
  labels,
  activeStep,
}: SideNavbarWithTitleProps) => {
  return (
    <Box minW="400px">
      <VStack
        alignItems="flex-start"
        spacing="90px"
        bgColor="background.gray.light"
        px="16"
        minH="100vh"
        position="fixed"
      >
        <Text textStyle="display-medium" pt={10}>
          {title}
        </Text>
        <SideNavBar activeStep={activeStep} labels={labels} />
      </VStack>
    </Box>
  );
};

export default SideNavbarWithTitle;

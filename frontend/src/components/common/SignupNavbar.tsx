import { Box, Flex, Image, Link } from "@chakra-ui/react";
import React from "react";

import Sistering_Logo from "../../assets/Sistering_Logo.svg";

const SignupNavbar = (): React.ReactElement => {
  return (
    <Box px="90px" boxShadow="md">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Image src={Sistering_Logo} alt="Sistering logo" h={14} />
        <Link href="/">Back to Main</Link>
      </Flex>
    </Box>
  );
};

export default SignupNavbar;

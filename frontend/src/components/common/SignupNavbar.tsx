import { Box, Flex, Image, Link } from "@chakra-ui/react";
import React from "react";

import Sistering_Logo from "../../assets/Sistering_Logo.svg";

const SignupNavbar = (): React.ReactElement => {
  return (
    <Box px="90px" boxShadow="md">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Link
          href="/"
          _focus={{ boxShadow: "none" }}
          _hover={{ transform: "scale(1.1)" }}
        >
          <Image src={Sistering_Logo} alt="Sistering logo" h={14} />
        </Link>
        <Link href="https://sistering.org/">Back to Main</Link>
      </Flex>
    </Box>
  );
};

export default SignupNavbar;

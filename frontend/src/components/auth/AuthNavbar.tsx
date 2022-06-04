import React from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
} from "@chakra-ui/react";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";

const AuthNavbar = (): React.ReactElement => {
  const history = useHistory();

  return (
    <Box px="90px" boxShadow="md">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Link href="https://sistering.org/">
          <Button leftIcon={<ArrowBackIcon w={8} h={8} />} variant="link">
            Back to Main
          </Button>
        </Link>
        <Menu>
          <MenuButton as={Button} variant="menuButton">
            Profile <ChevronDownIcon />
          </MenuButton>
          <MenuList textStyle="caption" color="black">
            <MenuItem onClick={() => history.push("/login")}>Sign in</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default AuthNavbar;

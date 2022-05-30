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
} from "@chakra-ui/react";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";

const AuthNavbar = (): React.ReactElement => {
  const history = useHistory();

  return (
    <Box px="90px" boxShadow="md">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Button
          leftIcon={<ArrowBackIcon w={8} h={8} />}
          variant="link"
          onClick={() => window.open("https://sistering.org/", "_blank")}
        >
          Back to Main
        </Button>
        <Menu>
          <MenuButton
            textStyle="button-semibold"
            color="text.gray"
            _hover={{ color: "teal" }}
            _active={{ color: "teal" }}
            mr="20px"
          >
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

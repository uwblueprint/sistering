import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Flex,
  Box,
  TabList,
  Tabs,
  Tab,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { AuthenticatedUser } from "../../types/AuthTypes";
import AuthContext from "../../contexts/AuthContext";
import { VolunteerPages } from "../../constants/Volunteer";
import Sistering_Logo from "../../assets/Sistering_Logo.svg";

const VolunteerNavbar = ({
  defaultIndex,
}: {
  defaultIndex: VolunteerPages;
}): React.ReactElement => {
  const {
    authenticatedUser,
  }: { authenticatedUser: AuthenticatedUser } = useContext(AuthContext);
  const userName = !authenticatedUser
    ? "Sistering Volunteer"
    : `${authenticatedUser.firstName} ${authenticatedUser.lastName}`;

  return (
    <Box px="90px">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Image src={Sistering_Logo} alt="Sistering logo" h={14} />
        <Tabs defaultIndex={defaultIndex} alignSelf="flex-end">
          <TabList>
            <Link to="/volunteer/shifts" style={{ textDecoration: "none" }}>
              <Tab
                color="violet"
                _hover={{
                  borderColor: "currentColor",
                  textDecoration: "none",
                }}
                _selected={{
                  color: "teal",
                  borderColor: "currentColor",
                  textDecoration: "none",
                }}
                py="26px"
              >
                My Shifts
              </Tab>
            </Link>
            <Link to="/volunteer/postings" style={{ textDecoration: "none" }}>
              <Tab
                color="violet"
                _hover={{
                  borderColor: "currentColor",
                }}
                _selected={{
                  color: "teal",
                  borderColor: "currentColor",
                }}
                py="26px"
              >
                Browse Volunteer Postings
              </Tab>
            </Link>
          </TabList>
        </Tabs>
        <Menu>
          <MenuButton
            textStyle="button-semibold"
            color="text.gray"
            _hover={{ color: "teal" }}
            _active={{ color: "teal" }}
            mr="20px"
          >
            {userName} <ChevronDownIcon />
          </MenuButton>
          <MenuList textStyle="caption" color="black">
            <MenuItem>Profile</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default VolunteerNavbar;

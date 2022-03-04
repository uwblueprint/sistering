import React from "react";
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
import { VolunteerPages } from "../../constants/Volunteer";
import Sistering_Screen_RGB from "../../assets/Sistering_Screen_RGB.png";

const VolunteerNavbar = ({
  defaultIndex,
}: {
  defaultIndex: VolunteerPages;
}): React.ReactElement => {
  return (
    <Box px="110px">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Image src={Sistering_Screen_RGB} alt="Sistering logo" h={14} />
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
          >
            Sistering Volunteer <ChevronDownIcon />
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

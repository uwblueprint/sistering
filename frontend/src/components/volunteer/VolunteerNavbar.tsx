import React from "react";
import { Route } from "react-router-dom";
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

import Sistering_Screen_RGB from "../../assets/Sistering_Screen_RGB.png";

const VolunteerNavbar = ({
  defaultIndex,
}: {
  defaultIndex: number;
}): React.ReactElement => {
  return (
    <Box px="110px">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Image src={Sistering_Screen_RGB} alt="Sistering logo" h={14} />
        <Route
          render={({ history }) => (
            <Tabs
              defaultIndex={defaultIndex}
              alignSelf="flex-end"
              onChange={(index) => {
                if (index === 0) history.push("/volunteer/shifts");
                else history.push("/volunteer/postings");
              }}
            >
              <TabList>
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
                  My Shifts
                </Tab>
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
              </TabList>
            </Tabs>
          )}
        />
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

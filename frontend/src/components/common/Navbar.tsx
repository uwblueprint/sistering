import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
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

import AuthContext from "../../contexts/AuthContext";
import Sistering_Logo from "../../assets/Sistering_Logo.svg";
import authAPIClient from "../../APIClients/AuthAPIClient";

type TabInfo = {
  name: string;
  route: string;
};

type NavbarProps = {
  defaultIndex: number;
  tabs: TabInfo[];
};

const LOGOUT = gql`
  mutation Logout($userId: ID!) {
    logout(userId: $userId)
  }
`;

const Navbar = ({ tabs, defaultIndex }: NavbarProps): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [logout] = useMutation<{ logout: null }>(LOGOUT);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(
      String(authenticatedUser?.id),
      logout,
    );
    if (success) {
      setAuthenticatedUser(null);
    }
  };

  const userName = `${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`;
  const history = useHistory();
  return (
    <Box px="90px" boxShadow="md">
      <Flex h="80px" alignItems="center" justifyContent="space-between">
        <Image src={Sistering_Logo} alt="Sistering logo" h={14} />
        <Tabs defaultIndex={defaultIndex} alignSelf="flex-end">
          <TabList>
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                color="violet"
                _hover={{
                  borderColor: "currentColor",
                }}
                _selected={{
                  color: "teal",
                  borderColor: "currentColor",
                }}
                py="26px"
                onClick={() => history.push(tab.route)}
              >
                {tab.name}
              </Tab>
            ))}
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
            <MenuItem onClick={onLogOutClick}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Navbar;

import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Box,
  Text,
  Input,
  FormControl,
  FormLabel,
  Image,
} from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { RESET_PASSWORD_PAGE, HOME_PAGE } from "../../constants/Routes";

import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

import ErrorModal from "../common/ErrorModal";
import AuthNavbar from "./AuthNavbar";

import logo from "../../assets/Sistering_Logo.svg";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const [login, { error: loginError }] = useMutation<{
    login: AuthenticatedUser;
  }>(LOGIN);

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(
      email,
      password,
      login,
    );
    setAuthenticatedUser(user);
  };

  const onForgotPasswordClick = () => {
    history.push(RESET_PASSWORD_PAGE);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <Box>
      <AuthNavbar />
      {loginError && <ErrorModal />}
      <Box width="100%" display="flex" flexDirection="row" height="100vh">
        <Box backgroundColor="background.white" flexGrow={4}>
          <Box maxWidth="480px" mt="8vh" mx="auto">
            {loginError && <ErrorModal />}
            <Image src={logo} alt="Sistering logo" h={32} />
            <Box mx="43px" mb="36px">
              <Text textStyle="display-large" fontWeight="bold" mb={8}>
                Sign In
              </Text>
              <FormControl alignItems="center">
                <FormLabel htmlFor="email" fontWeight="bold">
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(event.target.value)
                  }
                  placeholder="username@domain.com"
                  mb={5}
                />
                <FormLabel htmlFor="email" fontWeight="bold">
                  Password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(event.target.value)
                  }
                  placeholder="password"
                />
                <Text
                  onClick={onForgotPasswordClick}
                  cursor="pointer"
                  fontWeight="bold"
                  color="#7000E6"
                  float="right"
                  mt={2}
                >
                  Forgot Password?
                </Text>
                <Button onClick={onLogInClick} w="100%" mt={10}>
                  Login
                </Button>
              </FormControl>
            </Box>
          </Box>
        </Box>
        <Box backgroundColor="background.light" flexGrow={6} />
      </Box>
    </Box>
  );
};

export default Login;

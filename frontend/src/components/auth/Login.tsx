import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";
import { Text } from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { RESET_PASSWORD_PAGE, HOME_PAGE } from "../../constants/Routes";

import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

import ErrorModal from "../common/ErrorModal";
import AuthNavbar from "./AuthNavbar";

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
    <div>
      <AuthNavbar />
      <div style={{ textAlign: "center" }}>
        {loginError && <ErrorModal />}
        <Text textStyle="display-large">Login</Text>
        <form>
          <div>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="username@domain.com"
              style={{ border: "1px solid" }}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              style={{ border: "1px solid" }}
            />
          </div>
          <div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={onLogInClick}
            >
              Log In
            </button>
          </div>
        </form>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onForgotPasswordClick}
          >
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

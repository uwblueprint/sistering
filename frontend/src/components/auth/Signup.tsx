import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Text } from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import AuthNavbar from "./AuthNavbar";

const REGISTER = gql`
  mutation Signup_Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    register(
      user: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    ) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register] = useMutation<{ register: AuthenticatedUser }>(REGISTER);

  const onSignupClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.register(
      firstName,
      lastName,
      email,
      password,
      register,
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <div>
      <AuthNavbar />
      <div style={{ textAlign: "center" }}>
        <Text textStyle="display-large">Signup</Text>
        <form>
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="first name"
              style={{ border: "1px solid" }}
            />
          </div>
          <div>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="last name"
              style={{ border: "1px solid" }}
            />
          </div>
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
              onClick={onSignupClick}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

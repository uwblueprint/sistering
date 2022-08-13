import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";

import { useToast } from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const LOGOUT = gql`
  mutation Logout($userId: ID!) {
    logout(userId: $userId)
  }
`;

const Logout = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [logout] = useMutation<{ logout: null }>(LOGOUT);
  const toast = useToast();
  const onLogOutClick = async () => {
    try {
      const success = await authAPIClient.logout(
        String(authenticatedUser?.id),
        logout,
      );
      if (success) {
        setAuthenticatedUser(null);
      }
    } catch (error: unknown) {
      toast({
        title: "Cannot logout",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onLogOutClick}>
      Log Out
    </button>
  );
};

export default Logout;

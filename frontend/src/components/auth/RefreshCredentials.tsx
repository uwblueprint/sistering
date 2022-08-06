import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";

import { useToast } from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const REFRESH = gql`
  mutation Refresh {
    refresh
  }
`;

const RefreshCredentials = (): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const [refresh] = useMutation<{ refresh: string }>(REFRESH);

  const toast = useToast();

  const onRefreshClick = async () => {
    try {
      const success = await authAPIClient.refresh(refresh);
      if (!success) {
        setAuthenticatedUser(null);
      }
    } catch (error: unknown) {
      toast({
        title: "Cannot refresh",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onRefreshClick}>
      Refresh Credentials
    </button>
  );
};

export default RefreshCredentials;

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { LOGIN_PAGE } from "../../constants/Routes";

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;

const ResetPassword = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const [resetPassword] = useMutation<{ resetPassword: boolean }>(
    RESET_PASSWORD,
  );

  const onResetPasswordClick = async () => {
    await resetPassword({ variables: { email } });
  };

  const onBackToLoginClick = () => {
    history.push(LOGIN_PAGE)
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Reset Password</h1>
      <div>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="username@domain.com"
        />
      </div>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onResetPasswordClick}
        >
          Reset Password
        </button>
      </div>
      <div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={onBackToLoginClick}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

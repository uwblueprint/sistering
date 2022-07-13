export const accountCreationInviteTemplate = (
  role: string,
  inviteLink: string,
): string => {
  return `
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Raleway:wght@600&family=Work+Sans:wght@700&display=swap"
        rel="stylesheet"
      />
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-size: 14px;
        }
        .email {
          background: rgba(255, 255, 255, 1);
          opacity: 1;
          overflow: hidden;
        }
        .logo {
          width: 150px;
          height: 27px;
          background: url("https://firebasestorage.googleapis.com/v0/b/sistering-dev.appspot.com/o/sistering-logo.png?alt=media&token=58c68ee3-848b-4fcc-902c-77f3dbf252b6");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          opacity: 1;
          margin-top: 57px;
          margin-left: 70px;
          overflow: hidden;
        }
        .title {
          color: rgba(112, 0, 222, 1);
          padding-left: 70px;
          padding-top: 50px;
          font-family: work sans;
          font-weight: 700;
          font-size: 24px;
          opacity: 1;
          text-align: left;
        }
        .text {
          width: 600px;
          color: rgba(0, 0, 0, 1);
          padding-left: 70px;
          padding-top: 37px;
          font-family: inter;
          font-weight: medium;
          font-size: 18px;
          opacity: 1;
          text-align: left;
        }
        .btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0.5em 1em;
          background: #7000de;
          border-radius: 6px;
          width: 13em;
          height: 3em;
          flex: none;
          margin-left: 70px;
          margin-top: 37px;
          appearance: button;
          text-decoration: none;
          color: initial;
        }
        .btn-text {
          font-family: raleway;
          font-style: normal;
          font-weight: 600;
          font-size: 1.3em;
          display: flex;
          align-items: center;
          color: #ffffff;
          flex: none;
          order: 1;
          flex-grow: 0;
        }
      </style>
    </head>
    <body>
      <div class="email">
        <div class="logo"></div>
        <div class="title">Welcome to your ${role} account!</div>
        <div class="text">
          Click the button below to access your account. This link will expire in
          2 weeks.
        </div>
        <a class="btn" href="${inviteLink}" target="_blank">
          <span class="btn-text">Setup my account</span>
        </a>
      </div>
    </body>
  </html>
  `;
};

export const adminAccountCreationInviteTemplate = (
  inviteLink: string,
): string => {
  return accountCreationInviteTemplate("Administrator", inviteLink);
};

export const volunteerAccountCreationInviteTemplate = (
  inviteLink: string,
): string => {
  return accountCreationInviteTemplate("Volunteer", inviteLink);
};

export const accountCreationInviteReminderTemplate = (
  role: string,
  inviteLink: string,
): string => {
  return `
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Raleway:wght@600&family=Work+Sans:wght@700&display=swap"
        rel="stylesheet"
      />
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-size: 14px;
        }
        .email {
          background: rgba(255, 255, 255, 1);
          opacity: 1;
          overflow: hidden;
        }
        .logo {
          width: 150px;
          height: 27px;
          background: url("https://firebasestorage.googleapis.com/v0/b/sistering-dev.appspot.com/o/sistering-logo.png?alt=media&token=58c68ee3-848b-4fcc-902c-77f3dbf252b6");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          opacity: 1;
          margin-top: 57px;
          margin-left: 70px;
          overflow: hidden;
        }
        .title {
          color: rgba(112, 0, 222, 1);
          padding-left: 70px;
          padding-top: 45px;
          font-family: work sans;
          font-weight: 700;
          font-size: 24px;
          opacity: 1;
          text-align: left;
        }
        .text {
          width: 600px;
          color: rgba(0, 0, 0, 1);
          padding-left: 70px;
          padding-top: 42px;
          font-family: inter;
          font-weight: medium;
          font-size: 18px;
          opacity: 1;
          text-align: left;
        }
        .btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0.5em 1em;
          background: #7000de;
          border-radius: 6px;
          width: 13em;
          height: 3em;
          flex: none;
          margin-left: 70px;
          margin-top: 45px;
          appearance: button;
          text-decoration: none;
          color: initial;
        }
        .btn-text {
          font-family: raleway;
          font-style: normal;
          font-weight: 600;
          font-size: 1.3em;
          display: flex;
          align-items: center;
          color: #ffffff;
          flex: none;
          order: 1;
          flex-grow: 0;
        }
      </style>
    </head>
    <body>
      <div class="email">
        <div class="logo"></div>
        <div class="title">Hi! Your invitation link will be expiring soon</div>
        <div class="text">
          Click the button below to access your ${role} account. This link will
          expire in a week.
        </div>
        <a class="btn" href="${inviteLink}" target="_blank">
          <span class="btn-text">Setup my account</span>
        </a>
      </div>
    </body>
  </html>
  `;
};

export const adminAccountCreationInviteReminderTemplate = (
  inviteLink: string,
): string => {
  return accountCreationInviteTemplate("administrator", inviteLink);
};

export const volunteerAccountCreationInviteReminderTemplate = (
  inviteLink: string,
): string => {
  return accountCreationInviteTemplate("volunteer", inviteLink);
};

export const passwordResetTemplate = (resetLink: string): string => {
  return `
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Raleway:wght@600&family=Work+Sans:wght@700&display=swap"
        rel="stylesheet"
      />
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-size: 14px;
        }
        .email {
          background: rgba(255, 255, 255, 1);
          opacity: 1;
          overflow: hidden;
        }
        .logo {
          width: 150px;
          height: 27px;
          background: url("https://firebasestorage.googleapis.com/v0/b/sistering-dev.appspot.com/o/sistering-logo.png?alt=media&token=58c68ee3-848b-4fcc-902c-77f3dbf252b6");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          opacity: 1;
          margin-top: 57px;
          margin-left: 70px;
          overflow: hidden;
        }
        .title {
          color: rgba(112, 0, 222, 1);
          padding-left: 70px;
          padding-top: 45px;
          font-family: work sans;
          font-weight: 700;
          font-size: 24px;
          opacity: 1;
          text-align: left;
        }
        .text {
          width: 493px;
          color: rgba(0, 0, 0, 1);
          padding-left: 70px;
          padding-top: 42px;
          font-family: inter;
          font-weight: medium;
          font-size: 18px;
          opacity: 1;
          text-align: left;
        }
        .btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0.5em 1em;
          background: #7000de;
          border-radius: 6px;
          width: 12em;
          height: 3em;
          flex: none;
          margin-left: 70px;
          margin-top: 21px;
          appearance: button;
          text-decoration: none;
          color: initial;
        }
        .btn-text {
          font-family: raleway;
          font-style: normal;
          font-weight: 600;
          font-size: 1.3em;
          display: flex;
          align-items: center;
          color: #ffffff;
          flex: none;
          order: 1;
          flex-grow: 0;
        }
      </style>
    </head>
    <body>
      <div class="email">
        <div class="logo"></div>
        <div class="title">Hello, you requested a password reset</div>
        <div class="text">
          A password reset request was recieved from your account. Please click
          the button below to reset it. This link will expire in
          <strong>1 hour</strong>.
        </div>
        <a class="btn" href="${resetLink}" target="_blank">
          <span class="btn-text">Reset Password</span>
        </a>
      </div>
    </body>
  </html>
  `;
};

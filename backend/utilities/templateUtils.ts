import {
  ACCOUNT_CREATION_INVITE_REMINDER_STYLE,
  ACCOUNT_CREATION_INVITE_STYLE,
  FONT_LINKS,
  PASSWORD_RESET_STYLE,
} from "../constants/emailTemplates";

export const accountCreationInviteTemplate = (
  role: string,
  inviteLink: string,
): string => {
  return `
  <html>
    <head>
      ${FONT_LINKS}
      ${ACCOUNT_CREATION_INVITE_STYLE}
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
      ${FONT_LINKS}
      ${ACCOUNT_CREATION_INVITE_REMINDER_STYLE}
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
      ${FONT_LINKS}
      ${PASSWORD_RESET_STYLE}
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

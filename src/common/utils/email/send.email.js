import { createTransport } from "nodemailer";
import { EMAIL , PASSWORD} from "../../../config/config.service.js";

export const sendEmail = async ({
  from,
  to,
  subject,
  html,
}) => {
  const transporter = createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  return info.accepted.length ? true : false;
};

export const emailSubject = {
  CONFIRM_EMAIL: "Confirm Email",
  RESET_PASSWORD: "Reset Password",
};
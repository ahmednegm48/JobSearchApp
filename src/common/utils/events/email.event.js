import { EventEmitter } from "node:events";
import { emailSubject, sendEmail } from "../email/send.email.js";
import { emailTemplate } from "../email/email.template.js";
import { EMAIL } from "../../../config/config.service.js";

export const eventEmitter = new EventEmitter();
eventEmitter.on("Confirm Email", async (data) => {
  try{await sendEmail({
    from:EMAIL,
    to: data.to,
    subject:emailSubject.CONFIRM_EMAIL,
    html:emailTemplate(data.otp)
  })}catch(error){
    console.log("error sending Email",error);
  }
});
eventEmitter.on("Forget Password", async (data) => {
  try{await sendEmail({
    from:EMAIL,
    to: data.to,
    subject:emailSubject.RESET_PASSWORD,
    html:emailTemplate(data.otp)
  })}catch(error){
    console.log("error sending Email",error);
  }
});
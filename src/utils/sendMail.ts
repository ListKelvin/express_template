import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constant/env";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEamil = () =>
  NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

const getToEmail = (to: string) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEamil(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
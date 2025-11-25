import { Resend } from "resend";
import { emailTemplate } from "./mail.template";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = "https://sokol-krzywin.pl";

export const sendVerificationEmail = async (
  email: string,
  token: string,
  name: string,
) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`;

  const mail = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Potwierdzenie rejestracji na sokol-krzywin.pl",
    html: emailTemplate(name, confirmationLink),
  });

  console.log(mail, "mail");
};

import bcrypt from "bcryptjs";
import { generate } from "generate-password";
import nodemailer from "nodemailer";

import { prisma } from "@/lib/db";
import { render } from "@react-email/components";
import GeneratedPassword from "@/emails/generated-password";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    const devEmailUser = process.env.EMAIL_DEV_USER!;
    const devEmailPass = process.env.EMAIL_DEV_PASS!;
    const emailUser = process.env.EMAIL_USER!;
    const emailPass = process.env.EMAIL_PASS!;
    const baseUrl = process.env.NODE_ENV === "development" ? process.env.BASE_URL_DEV! : process.env.BASE_URL!;
    const devConfig = {
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: devEmailUser,
        pass: devEmailPass,
      },
    };
    const prodConfig = {
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };

    if (!name || !email) {
      return new Response("Dados inválidos", { status: 400 });
    }

    const generatedPassword = generate({
      length: 10,
      numbers: true,
    });

    const emailHtml = await render(
      GeneratedPassword({
        name: name as string,
        email: email as string,
        password: generatedPassword,
        url: `${baseUrl}/`,
      })
    );

    const options = {
      from: emailUser,
      to: email,
      subject: "Bem-vindo à Zuro!",
      html: emailHtml,
    };

    if (process.env.NODE_ENV === "development") {
      const transporter = nodemailer.createTransport(devConfig);

      await transporter.sendMail(options);
    } else {
      const transporter = nodemailer.createTransport(prodConfig);

      await transporter.sendMail(options);
    }

    const salt = await bcrypt.genSalt(10);
    const pwHash = await bcrypt.hash(generatedPassword, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        password: pwHash,
        emailVerified: new Date(),
      },
    });

    return new Response("Usuário criado com sucesso!", { status: 200 });
  } catch (error) {
    return new Response(`Register error: ${error}`, { status: 400 });
  }
}

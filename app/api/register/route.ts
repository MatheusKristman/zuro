import bcrypt from "bcryptjs";
import { generate } from "generate-password";

import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return new Response("Dados inválidos", { status: 400 });
    }

    const generatedPassword = generate({
      length: 10,
      numbers: true,
    });

    const salt = await bcrypt.genSalt(10);
    const pwHash = await bcrypt.hash(generatedPassword, salt);

    // TODO: enviar no e-mail a senha para o usuário
    console.log(generatedPassword);

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

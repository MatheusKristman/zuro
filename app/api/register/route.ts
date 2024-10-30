import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new Response("Dados inválidos", { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const pwHash = await bcrypt.hash(password, salt);

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

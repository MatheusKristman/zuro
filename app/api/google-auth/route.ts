import { google } from "googleapis";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Usuário não autenticado", { status: 401 });
    }

    const { email } = session.user;

    if (!email) {
      return new Response("Usuário não autenticado", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response("Usuário não encontrado", { status: 401 });
    }

    const redirectUrl =
      process.env.NODE_ENV === "development"
        ? process.env.REDIRECT_URI_DEV!
        : process.env.REDIRECT_URI!;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      redirectUrl,
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
      state: user.id,
    });

    return Response.redirect(authUrl, 303);
  } catch (err) {
    console.log(`[ERROR_GOOGLE_AUTH]: ${err}`);

    return new Response(`[ERROR_GOOGLE_AUTH]: ${err}`, { status: 500 });
  }
}

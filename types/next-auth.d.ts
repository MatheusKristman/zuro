import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Account {
    id?: string;
  }

  interface Session {
    user: {
      role: Role;
      googleId?: string | null;
      accessToken?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    googleId?: string | null;
    accessToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    googleId?: string | null;
    accessToken?: string | null;
  }
}

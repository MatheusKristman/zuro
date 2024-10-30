import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

import { auth } from "@/auth";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = await auth();

  return { req, resHeaders, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

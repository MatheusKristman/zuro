import { scheduleRouter } from "./routers/schedule";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  userRouter,
  scheduleRouter,
});

export type AppRouter = typeof appRouter;

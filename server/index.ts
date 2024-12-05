import { adminRouter } from "./routers/admin";
import { scheduleRouter } from "./routers/schedule";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  userRouter,
  scheduleRouter,
  adminRouter,
});

export type AppRouter = typeof appRouter;

import { adminRouter } from "./routers/admin";
import { scheduleRouter } from "./routers/schedule";
import { userRouter } from "./routers/user";
import { websiteRouter } from "./routers/website";
import { router } from "./trpc";

export const appRouter = router({
  userRouter,
  scheduleRouter,
  adminRouter,
  websiteRouter,
});

export type AppRouter = typeof appRouter;

import { nextAuthRouter } from "@/server/api/routers/nextauth";
import { openAiRouter } from "@/server/api/routers/openAi";
import { profileRouter } from "@/server/api/routers/profile";
import { createTRPCRouter } from "@/server/api/trpc";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  openAi: openAiRouter,
  nextauth: nextAuthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

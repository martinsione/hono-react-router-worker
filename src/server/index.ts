import { getAuthUser } from "@hono/auth-js";
import { drizzle } from "drizzle-orm/d1";
import { Hono, MiddlewareHandler } from "hono";
import { poweredBy } from "hono/powered-by";
import * as schema from "~/db/schema";
import { authMiddleware, authRoute } from "~/server/auth";
import { HonoEnv } from "~/server/utils/env";
import { reactRouter } from "./react-router";

function init(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    c.set("db", drizzle(c.env.DB, { schema }));
    return next();
  };
}

const app = new Hono<HonoEnv>()
  .use("*", init())
  .use("*", poweredBy())
  .use("*", authMiddleware())
  .get("/api/health", (c) => c.json({ message: "OK" }))
  .route("/api/auth", authRoute)
  .get("*", async (c, next) => {
    const PUBLIC_ROUTES = [
      "/__manifest", // react router internal
      "/sign-in",
      "/sign-up",
    ];

    const session = await getAuthUser(c);
    const isPublicRoute = PUBLIC_ROUTES.includes(new URL(c.req.url).pathname);

    if (!session && !isPublicRoute) return c.redirect("/sign-in");
    return next();
  })
  .get("*", reactRouter());
export type AppType = typeof app;

export default {
  fetch: async (
    req: Request,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) => {
    return app.fetch(req, env, ctx);
  },
};

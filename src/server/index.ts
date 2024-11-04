import { drizzle } from "drizzle-orm/d1";
import { Hono, MiddlewareHandler } from "hono";
import { poweredBy } from "hono/powered-by";
import * as schema from "~/db/schema";
import { authMiddleware, authRoute } from "~/server/auth";
import { HonoEnv } from "~/server/utils/env";

// app.use(
//   "*",
//   bearerAuth({
//     verifyToken: async (token, c) => {
//       const db = c.get("db");
//       const user = await db.query.users.findFirst({
//         where: eq(schema.users.id, token),
//       });
//       return !!user;
//     },
//   }),
// );

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
  .get("/health", (c) => c.json({ message: "OK" }))
  .route("/auth", authRoute);

export type AppType = typeof app;

export default {
  fetch: async (
    req: Request,
    env: CloudflareBindings & { NODE_ENV?: string },
    ctx: ExecutionContext,
  ) => {
    console.log({ path: new URL(req.url).pathname, city: req.cf?.city });

    const res = await app.fetch(req, env, ctx);
    if (res.status === 404) {
      /**
       * Right now service binding is not supported in dev mode
       * @see https://developers.cloudflare.com/workers/static-assets/#limitations
       */
      if (env.ENVIRONMENT === "production") return env.ASSETS.fetch(req);

      const { createRequestHandler } = await import("react-router");
      const handler = createRequestHandler(
        // @ts-expect-error - Not typed
        await import("virtual:react-router/server-build").catch(() => {}),
        // viteDevServer.ssrLoadModule("virtual:react-router/server-build"),
        "development",
      );
      return handler(req, {
        context: {
          cloudflare: {
            caches: globalThis.caches ? caches : undefined,
            cf: req.cf,
            ctx,
            env,
          },
        },
        request: req,
      });
    }
    return res;
  },
};

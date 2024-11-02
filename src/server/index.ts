import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", (c, next) => {
  c.res.headers.set("x-hono", "true");
  return next();
});

app.get("/ping", (c) => {
  return c.json({ message: "hi" });
});

export default {
  fetch: async (
    req: Request,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) => {
    const res = await app.fetch(req, env, ctx);
    if (res.status === 404) {
      if ((env as any).NODE_ENV !== "production") {
        /**
         * Right now service binding is not supported in dev mode
         * @see https://developers.cloudflare.com/workers/static-assets/#limitations
         */
        // @ts-expect-error - Not typed
        const build = await import("virtual:react-router/server-build");
        const { createRequestHandler } = await import("react-router");
        const handler = createRequestHandler(build, "development");

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
      return env.ASSETS.fetch(req);
    }
    return res;
  },
};

import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";
import schema from "~/db/schema";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: {
    db: DrizzleD1Database<typeof schema>;
  };
}>();

app.use("*", (c, next) => {
  c.res.headers.set("x-hono", "true");
  return next();
});

app.use("*", async (c, next) => {
  c.set("db", drizzle(c.env.DB, { schema }));
  return next();
});

app.get("/ping", (c) => {
  return c.json({ message: "hi" });
});

app.get("/api/users", async (c) => {
  const users = await c.get("db").query.users.findMany();
  return c.json(users);
});

app.post("/api/users", async (c) => {
  const db = c.get("db");
  const user = await db.insert(schema.users).values({
    id: crypto.randomUUID(),
    email: "test@test.com",
    password: "password",
  });
  return c.json(user);
});

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
      if (env.NODE_ENV !== "development") return env.ASSETS.fetch(req);

      const { createRequestHandler } = await import("react-router");
      const handler = createRequestHandler(
        // @ts-expect-error - Not typed
        await import("virtual:react-router/server-build").catch(() => {}),
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

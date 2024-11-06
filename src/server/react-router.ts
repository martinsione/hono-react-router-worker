import { MiddlewareHandler } from "hono";

export const reactRouter = (): MiddlewareHandler => {
  return async (c) => {
    const { createRequestHandler } = await import("react-router");

    let handler: ReturnType<typeof createRequestHandler>;
    if (c.env.ENVIRONMENT === "production") {
      handler = createRequestHandler(
        // @ts-expect-error - Not typed
        await import("../../build/server/index.js").catch(() => {}),
        "production",
      );
    } else {
      handler = createRequestHandler(
        // @ts-expect-error - Not typed
        await import("virtual:react-router/server-build").catch(() => {}),
        // viteDevServer.ssrLoadModule("virtual:react-router/server-build"),
        "development",
      );
    }

    return handler(c.req.raw, {
      req: c.req.raw,
      env: c.env,
      ctx: c.executionCtx,
    });
  };
};

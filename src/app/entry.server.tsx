import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  req: Request,
  status: number,
  headers: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const body = await renderToReadableStream(
    <ServerRouter
      context={routerContext}
      url={req.url}
      abortDelay={ABORT_DELAY}
    />,
    {
      signal: req.signal,
      onError(error: unknown) {
        console.error(error);
        status = 500;
      },
    },
  );

  const userAgent = req.headers.get("user-agent");
  if (userAgent && isbot(userAgent)) await body.allReady;

  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Transfer-Encoding", "chunked");

  return new Response(body, { headers, status });
}
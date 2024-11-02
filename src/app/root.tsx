import type { ReactNode } from "react";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import "./root.css";

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  let error = useRouteError();

  let title =
    error instanceof Error ? error.message : "Oops, something went wrong!";

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center">
      <div className="flex max-w-lg flex-col items-center justify-center gap-y-6">
        <h1 className="text-center text-4xl/none font-semibold text-balance">
          {title}
        </h1>

        <p className="text-center text-lg/normal text-balance">
          We're sorry, but an unexpected error has occurred. Please try again
          later or contact support if the issue persists.
        </p>

        <Link to="/">Go to Homepage</Link>

        {error instanceof Error && error.stack ? (
          <pre className="mt-4 w-full overflow-x-auto rounded-xl bg-black p-3 text-white">
            <code>{JSON.stringify(error.stack, null, "\t")}</code>
          </pre>
        ) : null}
      </div>
    </main>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-white text-black dark:bg-black dark:text-white"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh w-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

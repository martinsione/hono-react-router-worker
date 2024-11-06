import { SessionProvider } from "@hono/auth-js/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ClientLoaderFunction, LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { script } from "~/app/lib/theme-script";
import "~/app/root.css";

const loadFont = (href: string) =>
  ({
    rel: "preload",
    href,
    as: "font",
    type: "font/woff",
    crossOrigin: "anonymous",
  }) as const;

export const links: LinksFunction = () => [
  loadFont("/static/fonts/GeistVF.woff"),
  loadFont("/static/fonts/GeistMonoVF.woff"),
];

/**
 * For some reason, without a `clientLoader` there is a CSS FOUC.
 */
export const clientLoader: ClientLoaderFunction = async (args) => {};

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <div />;
}

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-background text-foreground font-mono"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script
          dangerouslySetInnerHTML={{ __html: `(${script.toString()})()` }}
        />

        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

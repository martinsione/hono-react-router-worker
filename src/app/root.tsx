import {
  SessionProvider,
  authConfigManager,
  getSession,
  useSession,
} from "@hono/auth-js/react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ClientLoaderFunction, LinksFunction } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
} from "react-router";
import { Loading } from "~/app/components/ui/loading";
import "~/app/root.css";
import { script } from "~/app/theme-script";

authConfigManager.setConfig({
  basePath: "/auth",
});

const loadFont = (href: string) =>
  ({ rel: "preload", href, as: "font", type: "font/woff" }) as const;

export const links: LinksFunction = () => [
  loadFont("/static/fonts/GeistVF.woff"),
  loadFont("/static/fonts/GeistMonoVF.woff"),
];

export const clientLoader: ClientLoaderFunction = async (args) => {
  const url = new URL(args.request.url);

  const session = await getSession();
  const AUTH_ROUTES = ["/sign-up", "/sign-in"];
  if (!session && !AUTH_ROUTES.includes(url.pathname)) {
    return redirect("/sign-up");
  }

  if (url.pathname === "/") {
    return redirect("/home");
  }
};

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <Loading />;
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
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `(${script.toString()})()` }}
        />

        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <div className="fade-in absolute inset-0 flex items-center justify-center">
          <SessionProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </SessionProvider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

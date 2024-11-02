import { motion } from "framer-motion";
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

const loadFont = (href: string) =>
  ({ rel: "preload", href, as: "font", type: "font/woff" }) as const;

export const links: LinksFunction = () => [
  loadFont("/static/fonts/GeistVF.woff"),
  loadFont("/static/fonts/GeistMonoVF.woff"),
];

export const clientLoader: ClientLoaderFunction = async (args) => {
  const url = new URL(args.request.url);
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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black font-mono text-white">
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
      <body>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {children}
        </motion.div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

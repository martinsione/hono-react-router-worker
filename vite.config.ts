import hono, { defaultOptions } from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    hono({
      adapter,
      env: { ENVIRONMENT: "development" },
      entry: "src/server/index.ts",
      exclude: [/^\/(src\/app)\/.+/, ...defaultOptions.exclude],
      injectClientScript: false,
    }),
    cloudflareDevProxy(),
    reactRouter({ appDirectory: "src/app", prerender: true }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "react-dom/server": "react-dom/server.browser",
    },
  },
});

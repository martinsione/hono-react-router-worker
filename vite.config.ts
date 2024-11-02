import hono, { defaultOptions } from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    hono({
      adapter,
      entry: "src/server/index.ts",
      exclude: [/^\/(src\/app)\/.+/, ...defaultOptions.exclude],
      injectClientScript: false,
      env: {
        NODE_ENV: "development",
      },
    }),
    reactRouter({
      appDirectory: "src/app",
      ssr: false,
      prerender: async (args) => {
        return args.getStaticPaths();
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
});

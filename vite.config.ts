import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import hono, {
  defaultOptions as honoDefaultOptions,
} from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    hono({
      adapter,
      entry: "src/server/index.ts",
      exclude: [/^\/(src\/app)\/.+/, ...honoDefaultOptions.exclude],
      injectClientScript: false,
    }),
    reactRouter({
      ssr: false,
      prerender: true,
      appDirectory: "src/app",
    }),
  ],
});

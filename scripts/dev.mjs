/**
 * This script let us run the app in development mode using `wrangler dev` but
 * and also watch changes in our app and re-build the React Router app.
 *
 * This way we will lose the HMR and HDR features, but instead we will be able
 * to test our app inside Wrangler which will let use simulate a Cloudflare
 * Worker environment and get access to all bindings without depending on the
 * Cloudflare Proxy API.
 */
import * as fs from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";

const appPath = path.join(import.meta.dirname, "../app");
const buildPath = path.join(import.meta.dirname, "../build");

await Promise.all([retry(run), watch()]);

/**
 * This function will build the app and start the server.
 */
async function run() {
  await $`bun run build`.nothrow();
  await $`bun run bun:start --test-scheduled`;
  //   exec("bun run build");
  //   exec("bun start --test-scheduled");
}

/**
 * This function will recursively watch the app directory and delete the build
 * directory when a change is detected.
 */
async function watch() {
  for await (let _ of fs.watch(appPath, { recursive: true })) {
    await fs.rm(buildPath, { recursive: true });
  }
}

/**
 * Retries a callback function if it fails
 * @param {() => Promise<void>} cb - The callback function to retry
 * @returns {Promise<void>}
 */
async function retry(cb) {
  await cb().catch(() => retry(cb));
}

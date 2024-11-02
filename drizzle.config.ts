import { defineConfig } from "drizzle-kit";
import { z } from "zod";

const env = z
  .object({
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    CLOUDFLARE_DATABASE_ID: z.string(),
    CLOUDFLARE_D1_TOKEN: z.string(),
  })
  .parse(process.env);

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  migrations: { prefix: "timestamp" },
  strict: true,
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: env.CLOUDFLARE_DATABASE_ID,
    token: env.CLOUDFLARE_D1_TOKEN,
  },
});

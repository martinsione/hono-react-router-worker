import CredentialsProvider from "@auth/core/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import * as schema from "~/db/schema";
import { HonoEnv } from "~/server/utils/env";

const SALT_ROUNDS = 10;

/**
 * @returns The SHA-256 hash of the string. Always in hex - 64 characters
 */
async function sha256(string: string) {
  const data = new TextEncoder().encode(string);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(string: string) {
  return bcrypt.hash(await sha256(string), SALT_ROUNDS);
}

async function comparePassword(plainText: string, hash: string) {
  return bcrypt.compare(await sha256(plainText), hash);
}

const EmailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authMiddleware = () =>
  initAuthConfig((c: Context<HonoEnv>) => {
    const url = new URL(c.req.url);
    // @ts-expect-error - Not typed.
    c.env.AUTH_URL = url.origin + "/auth";

    return {
      adapter: DrizzleAdapter(c.get("db")),
      session: {
        strategy: "jwt",
      },
      providers: [
        CredentialsProvider({
          id: "credentials",
          authorize: async (_, req) => {
            const db = c.get("db");
            const parsed = EmailPasswordSchema.safeParse(await req.json());
            if (!parsed.success) {
              throw new HTTPException(400, { message: "INVALID_CREDENTIALS" });
            }
            const { email, password } = parsed.data;

            const user = await db.query.users.findFirst({
              where: eq(schema.users.email, email),
            });

            if (
              !user ||
              !(await comparePassword(password, user.passwordHash!))
            ) {
              throw new HTTPException(400, { message: "INVALID_CREDENTIALS" });
            }

            return user;
          },
        }),
      ],
    };
  });

export const authRoute = new Hono<HonoEnv>()
  .post("/signup", zValidator("json", EmailPasswordSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const db = c.get("db");

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (user) {
      /* User already exists */
      throw new HTTPException(400, { message: "UNAUTHORIZED" });
    }

    await db.insert(schema.users).values({
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      passwordHash: await hashPassword(password),
    });

    return c.json({ message: "OK" });
  })
  .on(["GET", "POST"], "*", authHandler());

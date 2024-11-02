import { index, sqliteTable as table, text } from "drizzle-orm/sqlite-core";

export const users = table("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
});

export default {
  users,
};

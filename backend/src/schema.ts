import { pgTable, varchar, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  googleId: text("google_id").notNull(),
  email: text("email"),
  name: varchar("name", { length: 255 }).notNull(),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertUserType = typeof users.$inferInsert;
export type SelectUserType = typeof users.$inferSelect;

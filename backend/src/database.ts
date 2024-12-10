import { eq } from "drizzle-orm";
import { db } from "./db";
import { InsertUserType, SelectUserType, users } from "./schema";

export async function upsertUser(profile: InsertUserType) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.googleId, profile.googleId))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const [newUser] = await db.insert(users).values(profile).returning();

  return newUser;
}

export async function getUserByID(id: SelectUserType["id"]) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return user[0] || null;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id", { length: 255 }).primaryKey(),
    googleId: (0, pg_core_1.text)("google_id").notNull(),
    email: (0, pg_core_1.text)("email"),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    profilePicture: (0, pg_core_1.text)("profile_picture"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});

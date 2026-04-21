import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const grabs = sqliteTable(
  "grabs",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    ownerCookie: text("owner_cookie").notNull(),
    destinationUrl: text("destination_url").notNull(),
    label: text("label"),
    shortUrl: text("short_url"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("grabs_owner_idx").on(t.ownerCookie)]
);

export const clicks = sqliteTable(
  "clicks",
  {
    id: text("id").primaryKey(),
    grabId: text("grab_id")
      .notNull()
      .references(() => grabs.id, { onDelete: "cascade" }),
    ip: text("ip").notNull(),
    ipstackJson: text("ipstack_json"),
    userAgent: text("user_agent"),
    acceptLanguage: text("accept_language"),
    referrer: text("referrer"),
    continued: integer("continued").notNull().default(0),
    capturedAt: integer("captured_at").notNull(),
  },
  (t) => [index("clicks_grab_idx").on(t.grabId)]
);

export type Grab = typeof grabs.$inferSelect;
export type NewGrab = typeof grabs.$inferInsert;
export type Click = typeof clicks.$inferSelect;
export type NewClick = typeof clicks.$inferInsert;

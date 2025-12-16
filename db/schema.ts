import { relations } from "drizzle-orm";

import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const workshopModeEnum = pgEnum("workshop_mode", [
  "online",
  "offline",
  "both",
]);

export const courseStatusEnum = pgEnum("course_status", [
  "pending", // newly created
  "approved", // admin approved
  "rejected", // admin rejected
]);

export const workshops = pgTable("workshops", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 300 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  level: varchar("level", { length: 100 }).notNull(),
  date: varchar("date", { length: 40 }).notNull(),
  time: varchar("time", { length: 40 }).notNull(),
  duration: varchar("duration", { length: 40 }).notNull(),
  price: varchar("price", { length: 40 }).notNull(),
  mode: workshopModeEnum("mode").notNull(),
  address: text("address"), // nullable
  thumbnailUrl: text("thumbnail_url").notNull(),
  status: courseStatusEnum("status").default("pending").notNull(),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const registrations = pgTable("registrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workshopId: uuid("workshop_id") // <-- change from text to uuid
    .notNull()
    .references(() => workshops.id, { onDelete: "cascade" }),
  paymentStatus: text("payment_status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  amountPaid: integer("amount_paid").default(0).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  workshops: many(workshops),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const workshopRelations = relations(workshops, ({ one }) => ({
  author: one(user, {
    fields: [workshops.createdBy],
    references: [user.id],
  }),
}));

export const schema = { user, session, account, verification, workshops };

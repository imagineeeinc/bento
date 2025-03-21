import { integer, pgTable, boolean, json, timestamp, text } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
	password: text("password").notNull(),
})

export const notesTable = pgTable("notes", {
  id: text().primaryKey().notNull(),
  userId: integer("userId").references(() => usersTable.id).notNull(),
	lastUpdated: timestamp("lastUpdated", {withTimezone: true, mode: "date"}).notNull(),
	created: timestamp("created", {withTimezone: true, mode: "date"}).notNull(),
	delete: boolean("delete").notNull(),
	data: json().notNull(),
})

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: integer("userId").references(() => usersTable.id).notNull(),
	expiresAt: timestamp("expires_at", {withTimezone: true,mode: "date"}).notNull()
})

export const settingsTable = pgTable("settings", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	userId: integer("userId").references(() => usersTable.id).notNull(),
	settings: json().notNull(),
})	
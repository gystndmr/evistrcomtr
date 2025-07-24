import { pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  message: text("message").notNull(),
  sender: varchar("sender", { length: 10 }).notNull(), // 'user' or 'agent'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
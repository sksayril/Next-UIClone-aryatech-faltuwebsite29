import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  previewVideo: text("preview_video"), // For hover effect
  duration: text("duration").notNull(), // e.g. "12:34"
  views: text("views").notNull(), // e.g. "1.2M"
  author: text("author").notNull(),
  isHd: boolean("is_hd").default(false),
  is4k: boolean("is_4k").default(false),
  isVr: boolean("is_vr").default(false),
  rating: integer("rating").default(100), // Percent
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  count: integer("count"), // Optional video count
});

export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type VideoResponse = Video;
export type CategoryResponse = Category;

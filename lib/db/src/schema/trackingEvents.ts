import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { shipmentsTable } from "./shipments";

export const trackingEventsTable = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id")
    .notNull()
    .references(() => shipmentsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  location: text("location").notNull(),
  city: text("city"),
  country: text("country"),
  facility: text("facility"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  notes: text("notes"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTrackingEventSchema = createInsertSchema(trackingEventsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type TrackingEvent = typeof trackingEventsTable.$inferSelect;

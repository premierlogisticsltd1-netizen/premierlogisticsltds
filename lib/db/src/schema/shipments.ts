import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const SHIPMENT_STATUSES = [
  "pending",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  senderName: text("sender_name").notNull(),
  senderAddress: text("sender_address").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  status: text("status").notNull().default("pending"),
  weight: real("weight"),
  description: text("description"),
  estimatedDelivery: text("estimated_delivery"),
  /** FK to driversTable.id — nullable until a driver is assigned */
  assignedDriverId: integer("assigned_driver_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertShipmentSchema = createInsertSchema(shipmentsTable).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipmentsTable.$inferSelect;

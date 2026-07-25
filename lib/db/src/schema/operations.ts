import { createInsertSchema } from "drizzle-zod";
import { integer, real, serial, text, timestamp, boolean, date, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { shipmentsTable } from "./shipments";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").unique(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const driversTable = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  licenseNumber: text("license_number"),
  status: text("status").notNull().default("available"),
  currentLocation: text("current_location"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "set null" }),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  status: text("status").notNull().default("requested"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  serviceType: text("service_type").notNull().default("standard"),
  weight: real("weight"),
  estimatedCost: real("estimated_cost"),
  notes: text("notes"),
  validUntil: date("valid_until", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "set null" }),
  shipmentId: integer("shipment_id").references(() => shipmentsTable.id, { onDelete: "set null" }),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  dueDate: date("due_date", { mode: "string" }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  type: text("type").notNull().default("system"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proofOfDeliveryTable = pgTable("proof_of_delivery", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull().unique().references(() => shipmentsTable.id, { onDelete: "cascade" }),
  recipientName: text("recipient_name").notNull(),
  signatureUrl: text("signature_url"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type ContactMessage = typeof contactMessagesTable.$inferSelect;

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDriverSchema = createInsertSchema(driversTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuoteSchema = createInsertSchema(quotesTable).omit({ id: true, quoteNumber: true, createdAt: true, updatedAt: true });
export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({ id: true, invoiceNumber: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ id: true, createdAt: true });
export const insertProofOfDeliverySchema = createInsertSchema(proofOfDeliveryTable).omit({ id: true, createdAt: true, deliveredAt: true });

export type Customer = typeof customersTable.$inferSelect;
export type Driver = typeof driversTable.$inferSelect;
export type Quote = typeof quotesTable.$inferSelect;
export type Invoice = typeof invoicesTable.$inferSelect;
export type Notification = typeof notificationsTable.$inferSelect;
export type ProofOfDelivery = typeof proofOfDeliveryTable.$inferSelect;
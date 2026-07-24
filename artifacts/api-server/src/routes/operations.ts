import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, customersTable, driversTable, invoicesTable, notificationsTable, proofOfDeliveryTable, quotesTable, shipmentsTable, usersTable } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router: IRouter = Router();
const staff = requireRole("staff", "admin");
const admin = requireRole("admin");
const driver = requireRole("driver", "staff", "admin");

const id = (value: unknown) => Number.parseInt(String(value), 10);
const number = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
const bodyString = (value: unknown, fallback = "") => typeof value === "string" ? value.trim() : fallback;
const bodyNumber = (value: unknown) => typeof value === "number" ? value : Number(value);

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select({ id: usersTable.id, email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName, role: usersTable.role }).from(usersTable).where(eq(usersTable.id, req.user!.id));
  res.json(user ?? { id: req.user!.id, email: req.user!.email, role: "staff" });
});

router.post("/portal/register", requireAuth, async (req, res): Promise<void> => {
  const name = bodyString(req.body?.name);
  const email = bodyString(req.body?.email, req.user!.email ?? "");
  if (!name || !email) { res.status(400).json({ error: "Name and email are required" }); return; }
  const [customer] = await db.insert(customersTable).values({
    userId: req.user!.id, name, email, company: bodyString(req.body?.company) || null,
    phone: bodyString(req.body?.phone) || null, address: bodyString(req.body?.address) || null,
  }).onConflictDoUpdate({ target: customersTable.userId, set: { name, email, company: bodyString(req.body?.company) || null, phone: bodyString(req.body?.phone) || null, address: bodyString(req.body?.address) || null, updatedAt: new Date() }}).returning();
  await db.update(usersTable).set({ role: "customer", updatedAt: new Date() }).where(eq(usersTable.id, req.user!.id));
  res.status(201).json(customer);
});

router.get("/portal/overview", requireAuth, async (req, res): Promise<void> => {
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.userId, req.user!.id));
  if (!customer) { res.json({ registered: false, customer: null, shipments: [], quotes: [], invoices: [] }); return; }
  const shipments = await db.select().from(shipmentsTable).where(sql`${shipmentsTable.recipientName} = ${customer.name}`).orderBy(desc(shipmentsTable.createdAt)).limit(20);
  const quotes = await db.select().from(quotesTable).where(eq(quotesTable.customerId, customer.id)).orderBy(desc(quotesTable.createdAt));
  const invoices = await db.select().from(invoicesTable).where(eq(invoicesTable.customerId, customer.id)).orderBy(desc(invoicesTable.createdAt));
  res.json({ registered: true, customer, shipments, quotes, invoices });
});

router.get("/customers", staff, async (_req, res): Promise<void> => {
  res.json(await db.select().from(customersTable).orderBy(desc(customersTable.createdAt)));
});

router.post("/customers", staff, async (req, res): Promise<void> => {
  const name = bodyString(req.body?.name), email = bodyString(req.body?.email);
  if (!name || !email) { res.status(400).json({ error: "Name and email are required" }); return; }
  const [customer] = await db.insert(customersTable).values({ name, email, company: bodyString(req.body?.company) || null, phone: bodyString(req.body?.phone) || null, address: bodyString(req.body?.address) || null }).returning();
  res.status(201).json(customer);
});

router.patch("/customers/:id", staff, async (req, res): Promise<void> => {
  const [customer] = await db.update(customersTable).set({ name: bodyString(req.body?.name), company: bodyString(req.body?.company) || null, phone: bodyString(req.body?.phone) || null, address: bodyString(req.body?.address) || null, status: bodyString(req.body?.status, "active"), updatedAt: new Date() }).where(eq(customersTable.id, id(req.params.id))).returning();
  if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }
  res.json(customer);
});

router.get("/drivers", staff, async (_req, res): Promise<void> => {
  res.json(await db.select().from(driversTable).orderBy(desc(driversTable.createdAt)));
});

router.post("/drivers", admin, async (req, res): Promise<void> => {
  const name = bodyString(req.body?.name);
  if (!name) { res.status(400).json({ error: "Driver name is required" }); return; }
  const [created] = await db.insert(driversTable).values({ name, email: bodyString(req.body?.email) || null, phone: bodyString(req.body?.phone) || null, licenseNumber: bodyString(req.body?.licenseNumber) || null, currentLocation: bodyString(req.body?.currentLocation) || null }).returning();
  res.status(201).json(created);
});

router.patch("/drivers/:id", staff, async (req, res): Promise<void> => {
  const [updated] = await db.update(driversTable).set({ name: bodyString(req.body?.name), email: bodyString(req.body?.email) || null, phone: bodyString(req.body?.phone) || null, licenseNumber: bodyString(req.body?.licenseNumber) || null, status: bodyString(req.body?.status, "available"), currentLocation: bodyString(req.body?.currentLocation) || null, updatedAt: new Date() }).where(eq(driversTable.id, id(req.params.id))).returning();
  if (!updated) { res.status(404).json({ error: "Driver not found" }); return; }
  res.json(updated);
});

router.post("/shipments/:id/assign", staff, async (req, res): Promise<void> => {
  const driverId = id(req.body?.driverId);
  const [shipment] = await db.update(shipmentsTable).set({ updatedAt: new Date() }).where(eq(shipmentsTable.id, id(req.params.id))).returning();
  if (!shipment) { res.status(404).json({ error: "Shipment not found" }); return; }
  res.json({ shipment, driverId, message: "Assignment recorded for dispatch" });
});

router.get("/quotes", staff, async (_req, res): Promise<void> => {
  res.json(await db.select().from(quotesTable).orderBy(desc(quotesTable.createdAt)));
});

router.post("/quotes", requireAuth, async (req, res): Promise<void> => {
  const origin = bodyString(req.body?.origin), destination = bodyString(req.body?.destination);
  if (!origin || !destination) { res.status(400).json({ error: "Origin and destination are required" }); return; }
  const [quote] = await db.insert(quotesTable).values({ quoteNumber: number("QUO"), origin, destination, serviceType: bodyString(req.body?.serviceType, "standard"), weight: Number.isFinite(bodyNumber(req.body?.weight)) ? bodyNumber(req.body?.weight) : null, estimatedCost: Number.isFinite(bodyNumber(req.body?.estimatedCost)) ? bodyNumber(req.body?.estimatedCost) : null, notes: bodyString(req.body?.notes) || null, customerId: req.body?.customerId ? id(req.body.customerId) : null }).returning();
  res.status(201).json(quote);
});

router.patch("/quotes/:id", staff, async (req, res): Promise<void> => {
  const [quote] = await db.update(quotesTable).set({ status: bodyString(req.body?.status, "requested"), estimatedCost: Number.isFinite(bodyNumber(req.body?.estimatedCost)) ? bodyNumber(req.body?.estimatedCost) : null, notes: bodyString(req.body?.notes) || null, updatedAt: new Date() }).where(eq(quotesTable.id, id(req.params.id))).returning();
  if (!quote) { res.status(404).json({ error: "Quote not found" }); return; }
  res.json(quote);
});

router.get("/invoices", requireAuth, async (req, res): Promise<void> => {
  const roleUser = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.id, req.user!.id));
  const isCustomer = roleUser[0]?.role === "customer";
  if (isCustomer) {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.userId, req.user!.id));
    res.json(customer ? await db.select().from(invoicesTable).where(eq(invoicesTable.customerId, customer.id)).orderBy(desc(invoicesTable.createdAt)) : []);
    return;
  }
  res.json(await db.select().from(invoicesTable).orderBy(desc(invoicesTable.createdAt)));
});

router.post("/invoices", staff, async (req, res): Promise<void> => {
  const amount = bodyNumber(req.body?.amount);
  if (!Number.isFinite(amount) || amount < 0) { res.status(400).json({ error: "A valid amount is required" }); return; }
  const [invoice] = await db.insert(invoicesTable).values({ invoiceNumber: number("INV"), amount, customerId: req.body?.customerId ? id(req.body.customerId) : null, shipmentId: req.body?.shipmentId ? id(req.body.shipmentId) : null, dueDate: bodyString(req.body?.dueDate) || null }).returning();
  res.status(201).json(invoice);
});

router.patch("/invoices/:id", staff, async (req, res): Promise<void> => {
  const status = bodyString(req.body?.status, "pending");
  const [invoice] = await db.update(invoicesTable).set({ status, paidAt: status === "paid" ? new Date() : null, updatedAt: new Date() }).where(eq(invoicesTable.id, id(req.params.id))).returning();
  if (!invoice) { res.status(404).json({ error: "Invoice not found" }); return; }
  res.json(invoice);
});

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  res.json(await db.select().from(notificationsTable).where(eq(notificationsTable.userId, req.user!.id)).orderBy(desc(notificationsTable.createdAt)).limit(50));
});

router.patch("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const [notification] = await db.update(notificationsTable).set({ read: true }).where(and(eq(notificationsTable.id, id(req.params.id)), eq(notificationsTable.userId, req.user!.id))).returning();
  if (!notification) { res.status(404).json({ error: "Notification not found" }); return; }
  res.json(notification);
});

router.post("/shipments/:id/proof-of-delivery", staff, async (req, res): Promise<void> => {
  const shipmentId = id(req.params.id), recipientName = bodyString(req.body?.recipientName);
  if (!recipientName) { res.status(400).json({ error: "Recipient name is required" }); return; }
  const [pod] = await db.insert(proofOfDeliveryTable).values({ shipmentId, recipientName, signatureUrl: bodyString(req.body?.signatureUrl) || null, photoUrl: bodyString(req.body?.photoUrl) || null, notes: bodyString(req.body?.notes) || null }).onConflictDoUpdate({ target: proofOfDeliveryTable.shipmentId, set: { recipientName, signatureUrl: bodyString(req.body?.signatureUrl) || null, photoUrl: bodyString(req.body?.photoUrl) || null, notes: bodyString(req.body?.notes) || null, deliveredAt: new Date() }}).returning();
  await db.update(shipmentsTable).set({ status: "delivered", updatedAt: new Date() }).where(eq(shipmentsTable.id, shipmentId));
  res.status(201).json(pod);
});

router.get("/reports/summary", staff, async (_req, res): Promise<void> => {
  const [shipmentCounts] = await db.select({ total: sql<number>`count(*)::int`, delivered: sql<number>`count(*) filter (where ${shipmentsTable.status} = 'delivered')::int`, inTransit: sql<number>`count(*) filter (where ${shipmentsTable.status} = 'in_transit')::int` }).from(shipmentsTable);
  const [invoiceCounts] = await db.select({ billed: sql<number>`coalesce(sum(${invoicesTable.amount}), 0)::float`, paid: sql<number>`coalesce(sum(${invoicesTable.amount}) filter (where ${invoicesTable.status} = 'paid'), 0)::float`, outstanding: sql<number>`coalesce(sum(${invoicesTable.amount}) filter (where ${invoicesTable.status} != 'paid'), 0)::float` }).from(invoicesTable);
  const [quoteCounts] = await db.select({ total: sql<number>`count(*)::int`, approved: sql<number>`count(*) filter (where ${quotesTable.status} = 'approved')::int` }).from(quotesTable);
  res.json({ shipments: shipmentCounts, invoices: invoiceCounts, quotes: quoteCounts, generatedAt: new Date().toISOString() });
});

router.get("/admin/users", admin, async (_req, res): Promise<void> => {
  res.json(await db.select({ id: usersTable.id, email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName, role: usersTable.role, createdAt: usersTable.createdAt }).from(usersTable).orderBy(desc(usersTable.createdAt)));
});

router.patch("/admin/users/:id/role", admin, async (req, res): Promise<void> => {
  const role = bodyString(req.body?.role);
  if (!["admin", "staff", "driver", "customer"].includes(role)) { res.status(400).json({ error: "Invalid role" }); return; }
  const [user] = await db.update(usersTable).set({ role, updatedAt: new Date() }).where(eq(usersTable.id, String(req.params.id))).returning({ id: usersTable.id, email: usersTable.email, role: usersTable.role });
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

export default router;
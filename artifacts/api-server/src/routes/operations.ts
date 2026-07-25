import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, customersTable, driversTable, invoicesTable, notificationsTable, proofOfDeliveryTable, quotesTable, shipmentsTable, usersTable, contactMessagesTable, auditLogsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

async function logAudit(userId: string | undefined, action: string, resource: string, resourceId?: string, details?: string, ipAddress?: string) {
  try {
    await db.insert(auditLogsTable).values({ userId: userId ?? null, action, resource, resourceId: resourceId ?? null, details: details ?? null, ipAddress: ipAddress ?? null });
  } catch { /* non-blocking */ }
}

const router: IRouter = Router();
// All 7 roles that have staff-level access
const ALL_ROLES = ["admin", "manager", "operations", "support", "tracking_agent", "driver", "customer"] as const;
const staff = requireRole("staff", "admin", "manager", "operations", "support", "tracking_agent");
const admin = requireRole("admin", "manager");
const driver = requireRole("driver", "staff", "admin", "manager", "operations");

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
  const driverId = req.body?.driverId ? id(req.body.driverId) : null;
  const [shipment] = await db
    .update(shipmentsTable)
    .set({ assignedDriverId: driverId, updatedAt: new Date() })
    .where(eq(shipmentsTable.id, id(req.params.id)))
    .returning();
  if (!shipment) { res.status(404).json({ error: "Shipment not found" }); return; }

  // Fetch driver name for the response
  const driver = driverId
    ? (await db.select({ id: driversTable.id, name: driversTable.name }).from(driversTable).where(eq(driversTable.id, driverId)))[0]
    : null;

  res.json({ shipment, driver, message: driver ? `Assigned to ${driver.name}` : "Driver unassigned" });
});

router.get("/quotes", staff, async (_req, res): Promise<void> => {
  res.json(await db.select().from(quotesTable).orderBy(desc(quotesTable.createdAt)));
});

router.post("/public/quotes", async (req, res): Promise<void> => {
  const contactName = bodyString(req.body?.contactName);
  const contactEmail = bodyString(req.body?.contactEmail).toLowerCase();
  const origin = bodyString(req.body?.origin);
  const destination = bodyString(req.body?.destination);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);

  if (!contactName || !contactEmail || !emailIsValid || !origin || !destination) {
    res.status(400).json({ error: "Name, valid email, origin, and destination are required" });
    return;
  }

  const [quote] = await db.insert(quotesTable).values({
    quoteNumber: number("QUO"),
    contactName,
    contactEmail,
    contactPhone: bodyString(req.body?.contactPhone) || null,
    origin,
    destination,
    serviceType: bodyString(req.body?.serviceType, "standard"),
    weight: Number.isFinite(bodyNumber(req.body?.weight)) ? bodyNumber(req.body?.weight) : null,
    notes: bodyString(req.body?.notes) || null,
  }).returning();

  res.status(201).json(quote);
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
  const validRoles = ["admin", "manager", "operations", "support", "tracking_agent", "staff", "driver", "customer"];
  if (!validRoles.includes(role)) { res.status(400).json({ error: "Invalid role" }); return; }
  const [user] = await db.update(usersTable).set({ role, updatedAt: new Date() }).where(eq(usersTable.id, String(req.params.id))).returning({ id: usersTable.id, email: usersTable.email, role: usersTable.role });
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

// Convert approved quote to a shipment
router.post("/quotes/:id/convert", staff, async (req, res): Promise<void> => {
  const quoteId = id(req.params.id);
  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.id, quoteId));
  if (!quote) { res.status(404).json({ error: "Quote not found" }); return; }
  if (quote.status === "rejected") { res.status(400).json({ error: "Cannot convert a rejected quote" }); return; }

  const prefix = `PL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-`;
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(shipmentsTable);
  const seq = (Number(count) + 1).toString().padStart(6, "0");
  const trackingNumber = `${prefix}${seq}`;

  const senderName = bodyString(req.body?.senderName) || (quote.contactName ?? "Unknown Sender");
  const senderAddress = bodyString(req.body?.senderAddress) || quote.origin;

  const [shipment] = await db.insert(shipmentsTable).values({
    trackingNumber,
    senderName,
    senderAddress,
    recipientName: bodyString(req.body?.recipientName) || "TBD",
    recipientAddress: quote.destination,
    weight: quote.weight ?? undefined,
    description: quote.notes ?? undefined,
  }).returning();

  await db.update(quotesTable).set({ status: "approved", updatedAt: new Date() }).where(eq(quotesTable.id, quoteId));
  res.status(201).json({ shipment, message: `Shipment ${trackingNumber} created from quote ${quote.quoteNumber}` });
});

// Public contact form submission
router.post("/public/contact", async (req, res): Promise<void> => {
  const name = bodyString(req.body?.name);
  const email = bodyString(req.body?.email).toLowerCase();
  const message = bodyString(req.body?.message);
  if (!name || !email || !message) { res.status(400).json({ error: "Name, email, and message are required" }); return; }
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailIsValid) { res.status(400).json({ error: "A valid email is required" }); return; }
  const [msg] = await db.insert(contactMessagesTable).values({
    name, email,
    phone: bodyString(req.body?.phone) || null,
    subject: bodyString(req.body?.subject) || null,
    message,
  }).returning();
  res.status(201).json(msg);
});

// Admin: list contact messages
router.get("/admin/contact-messages", staff, async (_req, res): Promise<void> => {
  res.json(await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt)));
});

// Admin: update contact message status
router.patch("/admin/contact-messages/:id", staff, async (req, res): Promise<void> => {
  const status = bodyString(req.body?.status, "new");
  const [msg] = await db.update(contactMessagesTable).set({ status, assignedTo: bodyString(req.body?.assignedTo) || null, updatedAt: new Date() }).where(eq(contactMessagesTable.id, id(req.params.id))).returning();
  if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
  res.json(msg);
});

// Portal: update profile
router.patch("/portal/profile", requireAuth, async (req, res): Promise<void> => {
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.userId, req.user!.id));
  if (!customer) { res.status(404).json({ error: "Customer profile not found" }); return; }
  const [updated] = await db.update(customersTable).set({
    name: bodyString(req.body?.name) || customer.name,
    company: bodyString(req.body?.company) || null,
    phone: bodyString(req.body?.phone) || null,
    address: bodyString(req.body?.address) || null,
    updatedAt: new Date(),
  }).where(eq(customersTable.id, customer.id)).returning();
  res.json(updated);
});

// First-admin setup — only works when zero admins exist.
// Any authenticated user can call this; they become the first admin.
router.post("/admin/setup", requireAuth, async (req, res): Promise<void> => {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "admin"));
  if (Number(count) > 0) {
    res.status(409).json({ error: "An admin already exists. Contact your system administrator." });
    return;
  }
  const [user] = await db.update(usersTable).set({ role: "admin", updatedAt: new Date() }).where(eq(usersTable.id, req.user!.id)).returning();
  await logAudit(req.user!.id, "FIRST_ADMIN_SETUP", "user", req.user!.id, "First admin promoted via setup endpoint", req.ip);
  res.json({ message: "You are now the system administrator.", user });
});

// Audit log viewer — admin only
router.get("/admin/audit-logs", requireRole("admin", "manager"), async (req, res): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const offset = (page - 1) * limit;
  const logs = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt)).limit(limit).offset(offset);
  res.json({ logs, page, limit });
});

// Admin: role management with audit logging
router.patch("/admin/users/:id/role", requireRole("admin", "manager"), async (req, res): Promise<void> => {
  const userId = String(req.params.id);
  const role = bodyString(req.body?.role);
  if (!role) { res.status(400).json({ error: "role is required" }); return; }
  const [user] = await db.update(usersTable).set({ role: role as never, updatedAt: new Date() }).where(eq(usersTable.id, userId)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  await logAudit(req.user!.id, "ROLE_CHANGE", "user", userId, `Role changed to ${role}`, req.ip);
  res.json(user);
});

export default router;
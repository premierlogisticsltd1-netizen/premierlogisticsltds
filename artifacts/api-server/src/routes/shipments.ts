import { Router, type IRouter } from "express";
import { eq, ilike, or, and } from "drizzle-orm";
import { db, shipmentsTable } from "@workspace/db";
import {
  ListShipmentsQueryParams,
  CreateShipmentBody,
  GetShipmentParams,
  UpdateShipmentParams,
  UpdateShipmentBody,
  DeleteShipmentParams,
  ListShipmentsResponse,
  GetShipmentResponse,
  UpdateShipmentResponse,
  CreateShipmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateTrackingNumber(): string {
  const prefix = "CRR";
  const digits = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, "0");
  return `${prefix}${digits}`;
}

router.get("/shipments", async (req, res): Promise<void> => {
  const parsed = ListShipmentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, search } = parsed.data;

  const conditions = [];
  if (status) {
    conditions.push(eq(shipmentsTable.status, status));
  }
  if (search) {
    conditions.push(
      or(
        ilike(shipmentsTable.trackingNumber, `%${search}%`),
        ilike(shipmentsTable.senderName, `%${search}%`),
        ilike(shipmentsTable.recipientName, `%${search}%`),
        ilike(shipmentsTable.senderAddress, `%${search}%`),
        ilike(shipmentsTable.recipientAddress, `%${search}%`),
      ),
    );
  }

  const shipments =
    conditions.length > 0
      ? await db
          .select()
          .from(shipmentsTable)
          .where(conditions.length === 1 ? conditions[0] : and(...conditions))
          .orderBy(shipmentsTable.createdAt)
      : await db.select().from(shipmentsTable).orderBy(shipmentsTable.createdAt);

  res.json(ListShipmentsResponse.parse(shipments));
});

router.post("/shipments", async (req, res): Promise<void> => {
  const parsed = CreateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const trackingNumber = generateTrackingNumber();
  const [shipment] = await db
    .insert(shipmentsTable)
    .values({ ...parsed.data, trackingNumber })
    .returning();

  res.status(201).json(CreateShipmentResponse.parse(shipment));
});

router.get("/shipments/:id", async (req, res): Promise<void> => {
  const params = GetShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.id, params.data.id));

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.json(GetShipmentResponse.parse(shipment));
});

router.patch("/shipments/:id", async (req, res): Promise<void> => {
  const params = UpdateShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [shipment] = await db
    .update(shipmentsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(shipmentsTable.id, params.data.id))
    .returning();

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.json(UpdateShipmentResponse.parse(shipment));
});

router.delete("/shipments/:id", async (req, res): Promise<void> => {
  const params = DeleteShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(shipmentsTable)
    .where(eq(shipmentsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;

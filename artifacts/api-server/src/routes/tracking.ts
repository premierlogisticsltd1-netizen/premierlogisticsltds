import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, shipmentsTable, trackingEventsTable } from "@workspace/db";
import {
  ListShipmentEventsParams,
  AddTrackingEventParams,
  AddTrackingEventBody,
  TrackShipmentParams,
  ListShipmentEventsResponse,
  AddTrackingEventResponse,
  TrackShipmentResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/shipments/:id/events", requireAuth, async (req, res): Promise<void> => {
  const params = ListShipmentEventsParams.safeParse(req.params);
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

  const events = await db
    .select()
    .from(trackingEventsTable)
    .where(eq(trackingEventsTable.shipmentId, params.data.id))
    .orderBy(asc(trackingEventsTable.timestamp));

  res.json(ListShipmentEventsResponse.parse(events));
});

router.post("/shipments/:id/events", requireAuth, async (req, res): Promise<void> => {
  const params = AddTrackingEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = AddTrackingEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
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

  // Update shipment status to match the new event
  await db
    .update(shipmentsTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(shipmentsTable.id, params.data.id));

  const [event] = await db
    .insert(trackingEventsTable)
    .values({
      shipmentId: params.data.id,
      status: parsed.data.status,
      location: parsed.data.location,
      notes: parsed.data.notes,
      timestamp: parsed.data.timestamp ? new Date(parsed.data.timestamp) : new Date(),
    })
    .returning();

  res.status(201).json(AddTrackingEventResponse.parse(event));
});

router.get("/track/:trackingNumber", async (req, res): Promise<void> => {
  const params = TrackShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, params.data.trackingNumber));

  if (!shipment) {
    res.status(404).json({ error: "Tracking number not found" });
    return;
  }

  const events = await db
    .select()
    .from(trackingEventsTable)
    .where(eq(trackingEventsTable.shipmentId, shipment.id))
    .orderBy(asc(trackingEventsTable.timestamp));

  res.json(TrackShipmentResponse.parse({ shipment, events }));
});

export default router;

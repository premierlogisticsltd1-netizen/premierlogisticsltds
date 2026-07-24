import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, shipmentsTable } from "@workspace/db";
import { GetDashboardStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      status: shipmentsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(shipmentsTable)
    .groupBy(shipmentsTable.status);

  const byStatus: Record<string, number> = {};
  let total = 0;
  for (const row of rows) {
    byStatus[row.status] = row.count;
    total += row.count;
  }

  const stats = {
    total,
    pending: byStatus["pending"] ?? 0,
    pickedUp: byStatus["picked_up"] ?? 0,
    inTransit: byStatus["in_transit"] ?? 0,
    outForDelivery: byStatus["out_for_delivery"] ?? 0,
    delivered: byStatus["delivered"] ?? 0,
    failed: byStatus["failed"] ?? 0,
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

export default router;

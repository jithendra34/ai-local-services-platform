import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, workersTable, activityTable } from "@workspace/db";
import { eq, count, sum, desc } from "drizzle-orm";

const router = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const [revenueResult] = await db
      .select({ total: sum(bookingsTable.totalCost) })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "completed"));

    const [activeBookingsResult] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "pending"));

    const [activeWorkersResult] = await db
      .select({ count: count() })
      .from(workersTable)
      .where(eq(workersTable.verified, true));

    const [pendingVerificationsResult] = await db
      .select({ count: count() })
      .from(workersTable)
      .where(eq(workersTable.verified, false));

    res.json({
      totalRevenue: Number(revenueResult?.total ?? 0),
      activeBookings: Number(activeBookingsResult?.count ?? 0),
      activeWorkers: Number(activeWorkersResult?.count ?? 0),
      pendingVerifications: Number(pendingVerificationsResult?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

router.get("/admin/activity", async (req, res) => {
  try {
    const activity = await db
      .select()
      .from(activityTable)
      .orderBy(desc(activityTable.createdAt))
      .limit(10);
    res.json(activity);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

router.get("/admin/bookings-by-service", async (req, res) => {
  try {
    const bookings = await db.select().from(bookingsTable);
    const counts: Record<string, number> = {};
    for (const b of bookings) {
      counts[b.service] = (counts[b.service] ?? 0) + 1;
    }
    const result = Object.entries(counts).map(([service, count]) => ({
      service,
      count,
    }));
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch bookings by service" });
  }
});

export default router;

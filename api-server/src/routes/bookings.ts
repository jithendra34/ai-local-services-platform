import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, servicesTable, activityTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateBookingBody,
  UpdateBookingStatusBody,
  EstimateBookingCostBody,
  GetBookingParams,
  UpdateBookingStatusParams,
} from "@workspace/api-zod";

const router = Router();

const URGENCY_MULTIPLIERS: Record<string, number> = {
  normal: 0,
  urgent: 0.25,
  emergency: 0.5,
};

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await db
      .select()
      .from(bookingsTable)
      .orderBy(bookingsTable.createdAt);
    const sorted = [...bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(sorted);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/bookings/estimate", async (req, res) => {
  const parsed = EstimateBookingCostBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const { service, urgency } = parsed.data;

  const [svc] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.name, service));

  const baseEstimate = svc ? svc.basePrice : 300;
  const multiplier = URGENCY_MULTIPLIERS[urgency] ?? 0;
  const urgencyFee = Math.round(baseEstimate * multiplier);
  const totalEstimate = baseEstimate + urgencyFee;

  res.json({
    baseEstimate,
    urgencyFee,
    totalEstimate,
    urgencyApplied: urgencyFee > 0,
  });
});

router.get("/bookings/:id", async (req, res) => {
  const parsed = GetBookingParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, parsed.data.id));

  if (!booking) return res.status(404).json({ error: "Not found" });
  res.json(booking);
});

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const { service, description, address, city, urgency } = parsed.data;

  const [svc] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.name, service));

  const baseCost = svc ? svc.basePrice : 300;
  const multiplier = URGENCY_MULTIPLIERS[urgency] ?? 0;
  const urgencyFee = Math.round(baseCost * multiplier);
  const totalCost = baseCost + urgencyFee;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      service,
      description,
      address,
      city,
      urgency,
      status: "pending",
      baseCost,
      urgencyFee,
      totalCost,
    })
    .returning();

  await db.insert(activityTable).values({
    title: `New booking: ${service}`,
    subtitle: `Booking created in ${city}`,
    type: "booking",
  });

  res.status(201).json(booking);
});

router.patch("/bookings/:id", async (req, res) => {
  const paramParsed = UpdateBookingStatusParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) return res.status(400).json({ error: "Invalid id" });

  const bodyParsed = UpdateBookingStatusBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { status, workerId, finalCost } = bodyParsed.data;

  const updateData: Record<string, unknown> = { status };
  if (workerId !== undefined) updateData.workerId = workerId;
  if (finalCost !== undefined) {
    updateData.totalCost = finalCost;
  }
  if (status === "completed") {
    updateData.completedAt = new Date();
  }

  const [updated] = await db
    .update(bookingsTable)
    .set(updateData)
    .where(eq(bookingsTable.id, paramParsed.data.id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Not found" });

  if (status === "completed") {
    await db.insert(activityTable).values({
      title: "Job Completed",
      subtitle: `${updated.service} in ${updated.city}`,
      type: "completion",
    });
  }

  res.json(updated);
});

export default router;

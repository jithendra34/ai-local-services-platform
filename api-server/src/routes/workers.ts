import { Router } from "express";
import { db } from "@workspace/db";
import { workersTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import { GetWorkerParams, ListWorkersQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/workers", async (req, res) => {
  try {
    const parsed = ListWorkersQueryParams.safeParse(req.query);
    const query = parsed.success ? parsed.data : {};

    let workers = await db.select().from(workersTable);

    if (query.search) {
      const search = query.search.toLowerCase();
      workers = workers.filter(
        (w) =>
          w.name.toLowerCase().includes(search) ||
          w.specialty.toLowerCase().includes(search) ||
          w.skills.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (query.specialty && query.specialty !== "All Services") {
      workers = workers.filter(
        (w) => w.specialty.toLowerCase() === query.specialty!.toLowerCase()
      );
    }

    res.json(workers);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

router.get("/workers/:id", async (req, res) => {
  const parsed = GetWorkerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });

  const [worker] = await db
    .select()
    .from(workersTable)
    .where(eq(workersTable.id, parsed.data.id));

  if (!worker) return res.status(404).json({ error: "Not found" });
  res.json(worker);
});

export default router;

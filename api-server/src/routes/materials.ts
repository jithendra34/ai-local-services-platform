import { Router } from "express";
import { db } from "@workspace/db";
import { materialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListMaterialsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/materials", async (req, res) => {
  try {
    const parsed = ListMaterialsQueryParams.safeParse(req.query);
    const query = parsed.success ? parsed.data : {};

    let materials = await db.select().from(materialsTable);

    if (query.category && query.category !== "all") {
      materials = materials.filter((m) => m.category === query.category);
    }

    if (query.search) {
      const search = query.search.toLowerCase();
      materials = materials.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.brand.toLowerCase().includes(search)
      );
    }

    res.json(materials);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
});

export default router;

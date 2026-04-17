import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import bookingsRouter from "./bookings";
import workersRouter from "./workers";
import materialsRouter from "./materials";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(bookingsRouter);
router.use(workersRouter);
router.use(materialsRouter);
router.use(adminRouter);

export default router;

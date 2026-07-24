import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import shipmentsRouter from "./shipments";
import trackingRouter from "./tracking";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(shipmentsRouter);
router.use(trackingRouter);
router.use(dashboardRouter);

export default router;

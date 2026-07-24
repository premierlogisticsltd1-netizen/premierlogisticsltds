import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import shipmentsRouter from "./shipments";
import trackingRouter from "./tracking";
import dashboardRouter from "./dashboard";
import operationsRouter from "./operations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(shipmentsRouter);
router.use(trackingRouter);
router.use(dashboardRouter);
router.use(operationsRouter);

export default router;

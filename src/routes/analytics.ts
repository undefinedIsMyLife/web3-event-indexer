import { Router } from "express";
import { getTransferAnalytics } from "../controllers/analytics";

const router = Router();

// GET /analytics/transfers/:contractId
router.get("/transfers/:contractId", getTransferAnalytics);

export default router;

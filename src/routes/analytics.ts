import { Router } from "express";
import {
  getOverview,
  getTopAddresses,
  getTimeSeries
} from "../controllers/analytics";

const router = Router();

router.get("/overview", getOverview);
router.get("/top-addresses", getTopAddresses);
router.get("/timeseries", getTimeSeries);

export default router;

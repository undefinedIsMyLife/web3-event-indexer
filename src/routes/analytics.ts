import { Router } from "express";
import {
  getOverview,
  getTopAddresses,
} from "../controllers/analytics";

const router = Router();

router.get("/overview", getOverview);
router.get("/top-addresses", getTopAddresses);

export default router;

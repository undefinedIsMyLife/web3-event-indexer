import { Request, Response } from "express";
import {
  getTransferStats,
  getDailyVolume,
  getDailyTransferCount,
  getTopSenders,
  getTopReceivers,
} from "../services/analytics";

export async function getTransferAnalytics(
  req: Request,
  res: Response
) {
  try {
    const contractId = Number(req.params.contractId);

    if (isNaN(contractId)) {
      return res.status(400).json({ error: "Invalid contractId" });
    }

    const [
      stats,
      dailyVolume,
      dailyCount,
      topSenders,
      topReceivers,
    ] = await Promise.all([
      getTransferStats(contractId),
      getDailyVolume(contractId, ),
      getDailyTransferCount(contractId, 30),
      getTopSenders(contractId),
      getTopReceivers(contractId),
    ]);

    res.json({
      contractId,
      stats,
      dailyVolume,
      dailyCount,
      topSenders,
      topReceivers,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

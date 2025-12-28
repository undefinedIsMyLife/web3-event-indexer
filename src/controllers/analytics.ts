import { Request, Response } from "express";
import {
  getTransferStats,
  getTopSenders,
  getTopReceivers,
  getDailyVolume,
  getDailyTransferCount,
} from "../services/analytics";

const CONTRACT_ID = 1; // temporary (we'll improve later)

export async function getOverview(req: Request, res: Response) {
  const stats = await getTransferStats(CONTRACT_ID);
  res.json(stats);
}

export async function getTopAddresses(req: Request, res: Response) {
  const limit = Number(req.query.limit) || 10;

  const [senders, receivers] = await Promise.all([
    getTopSenders(CONTRACT_ID, limit),
    getTopReceivers(CONTRACT_ID, limit),
  ]);

  res.json({
    topSenders: senders,
    topReceivers: receivers,
  });
}
// Time series data for transfers and volume over the past N days
export async function getTimeSeries(req: Request, res: Response) {
  const days = Number(req.query.days) || 7;
  const CONTRACT_ID = 1;

  const [volume, transfers] = await Promise.all([
    getDailyVolume(CONTRACT_ID, days),
    getDailyTransferCount(CONTRACT_ID, days),
  ]);

  res.json({
    volume,
    transfers,
  });
}

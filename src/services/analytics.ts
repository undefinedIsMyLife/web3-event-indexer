import { prisma } from "./prisma";
import Decimal from "decimal.js";

/**
 * Convert raw ERC-20 value to human-readable amount
 */
export function normalizeValue(
  raw: Decimal,
  decimals: number
): Decimal {
  return raw.div(new Decimal(10).pow(decimals));
}

/**
 * Transfer count + normalized volume
 */
export async function getTransferStats(contractId: number) {
  const events = await prisma.event.findMany({
    where: {
      contractId,
      eventName: "Transfer",
    },
    include: {
      token: true,
    },
  });

  let totalVolume = new Decimal(0);

  for (const event of events) {
    if (!event.value || !event.token) continue;

    const raw = new Decimal(event.value.toString());
    const normalized = normalizeValue(raw, event.token.decimals);

    totalVolume = totalVolume.add(normalized);
  }

  return {
    transferCount: events.length,
    totalVolume: totalVolume.toString(),
  };
}

/**
 * Top senders (normalized)
 */
export async function getTopSenders(contractId: number, limit = 10) {
  const events = await prisma.event.findMany({
    where: {
      contractId,
      eventName: "Transfer",
      fromAddress: { not: null },
    },
    include: {
      token: true,
    },
  });

  const map = new Map<string, Decimal>();

  for (const event of events) {
    if (!event.value || !event.token || !event.fromAddress) continue;

    const raw = new Decimal(event.value.toString());
    const normalized = normalizeValue(raw, event.token.decimals);

    map.set(
      event.fromAddress,
      (map.get(event.fromAddress) ?? new Decimal(0)).add(normalized)
    );
  }

  return [...map.entries()]
    .sort((a, b) => b[1].comparedTo(a[1]))
    .slice(0, limit)
    .map(([address, value]) => ({
      address,
      value: value.toString(),
    }));
}

/**
 * Top receivers (normalized)
 */
export async function getTopReceivers(contractId: number, limit = 10) {
  const events = await prisma.event.findMany({
    where: {
      contractId,
      eventName: "Transfer",
      toAddress: { not: null },
    },
    include: {
      token: true,
    },
  });

  const map = new Map<string, Decimal>();

  for (const event of events) {
    if (!event.value || !event.token || !event.toAddress) continue;

    const raw = new Decimal(event.value.toString());
    const normalized = normalizeValue(raw, event.token.decimals);

    map.set(
      event.toAddress,
      (map.get(event.toAddress) ?? new Decimal(0)).add(normalized)
    );
  }

  return [...map.entries()]
    .sort((a, b) => b[1].comparedTo(a[1]))
    .slice(0, limit)
    .map(([address, value]) => ({
      address,
      value: value.toString(),
    }));
}


/**
 * Daily Volume (normalized)
 */
export async function getDailyVolume(
  contractId: number,
  days: number = 7
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.event.findMany({
    where: {
      contractId,
      eventName: "Transfer",
      createdAt: { gte: since },
    },
    include: {
      token: true,
    },
  });

  const dailyMap = new Map<string, Decimal>();

  for (const event of events) {
    if (!event.value || !event.token) continue;

    const day = event.createdAt.toISOString().slice(0, 10);

    const raw = new Decimal(event.value.toString());
    const normalized = normalizeValue(raw, event.token.decimals);

    dailyMap.set(
      day,
      (dailyMap.get(day) ?? new Decimal(0)).add(normalized)
    );
  }

  return [...dailyMap.entries()].map(([date, volume]) => ({
    date,
    volume: volume.toString(),
  }));
}

/**
 * Daily Transfer Count (normalized)
 */
export async function getDailyTransferCount(
  contractId: number,
  days: number = 7
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.event.findMany({
    where: {
      contractId,
      eventName: "Transfer",
      createdAt: { gte: since },
    },
    select: {
      createdAt: true,
    },
  });

  const dailyCount: Record<string, number> = {};

  for (const event of events) {
    const day = event.createdAt.toISOString().slice(0, 10);
    dailyCount[day] = (dailyCount[day] ?? 0) + 1;
  }

  return Object.entries(dailyCount).map(([date, count]) => ({
    date,
    count,
  }));
}

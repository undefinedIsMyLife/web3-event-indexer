import { prisma } from "./prisma";

// Retrieves analytics data for Transfer events of a specific contract
export async function getTransferStats(contractId: number) {
  const [count, volume] = await Promise.all([
    prisma.event.count({
      where: {
        contractId,
        eventName: "Transfer",
      },
    }),
    prisma.event.aggregate({
      where: {
        contractId,
        eventName: "Transfer",
      },
      _sum: {
        value: true,
      },
    }),
  ]);

  return {
    transferCount: count,
    totalVolume: volume._sum.value ?? "0",
  };
}

// Retrieves top sender addresses by total sent value for a specific contract
export async function getTopSenders(contractId: number, limit = 10) {
  return prisma.event.groupBy({
    by: ["fromAddress"],
    where: {
      contractId,
      eventName: "Transfer",
    },
    _sum: {
      value: true,
    },
    orderBy: {
      _sum: {
        value: "desc",
      },
    },
    take: limit,
  });
}

// Retrieves top receiver addresses by total received value for a specific contract
export async function getTopReceivers(contractId: number, limit = 10) {
  return prisma.event.groupBy({
    by: ["toAddress"],
    where: {
      contractId,
      eventName: "Transfer",
    },
    _sum: {
      value: true,
    },
    orderBy: {
      _sum: {
        value: "desc",
      },
    },
    take: limit,
  });
}
// Retrieves daily transfer volume for the past specified number of days
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
      createdAt: {
        gte: since,
      },
    },
    select: {
      value: true,
      createdAt: true,
    },
  });

  const dailyMap: Record<string, bigint> = {};

    for (const event of events) {
        const day = event.createdAt.toISOString().slice(0, 10);

        const value = BigInt(event.value?.toString() ?? "0");

        dailyMap[day] = (dailyMap[day] ?? 0n) + value;
    }


  return Object.entries(dailyMap).map(([date, volume]) => ({
    date,
    volume: volume.toString(),
  }));
}
// Retrieves daily transfer volume for the past specified number of days
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
      createdAt: {
        gte: since,
      },
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

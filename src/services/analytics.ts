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

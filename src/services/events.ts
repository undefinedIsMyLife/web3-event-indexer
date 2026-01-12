import { prisma } from "./prisma";

export async function listEvents(params: {
  limit?: number;
  cursor?: number;
  fromAddress?: string;
  toAddress?: string;
}) {
  const limit = params.limit ?? 50;

  const where: any = {};

  if (params.fromAddress) {
    where.fromAddress = params.fromAddress;
  }

  if (params.toAddress) {
    where.toAddress = params.toAddress;
  }

  const query: any = {
    take: limit,
    orderBy: { id: "asc" },
    where,
  };

  if (params.cursor) {
    query.cursor = { id: params.cursor };
    query.skip = 1;
  }

  return prisma.event.findMany(query);
}

import { prisma } from "./prisma";

export async function getOrCreateContract(
  address: string,
  chainId: number,
  name?: string
) {
  return prisma.contract.upsert({
    where: { address },
    update: {},
    create: {
      address,
      chainId,
      name: name ?? null, // ✅ FIX
    },
  });
}

//Before indexing events, we must tell the system what contract we are indexing.
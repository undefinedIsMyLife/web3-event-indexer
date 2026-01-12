import { ethers } from "ethers";
import { prisma } from "./prisma";

const ERC20_ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

export async function getOrCreateToken(
  provider: ethers.Provider,
  tokenAddress: string
) {
  const address = tokenAddress.toLowerCase();

  // 1️⃣ Check DB
  const existing = await prisma.token.findUnique({
    where: { address },
  });

  if (existing) return existing;

  // 2️⃣ Read metadata from chain
  const erc20 = new ethers.Contract(
    address,
    ERC20_ABI,
    provider
  ) as unknown as {
    symbol: () => Promise<string>;
    decimals: () => Promise<number>;
  };

  const symbol = await erc20.symbol();
  const decimals = Number(await erc20.decimals());


  // 3️⃣ Save
  return prisma.token.create({
    data: {
      address,
      symbol,
      decimals,
    },
  });
}

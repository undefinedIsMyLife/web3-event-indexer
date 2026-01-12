import { prisma } from "./prisma";

export async function saveTransferEvent(data: {
  contractId: number;
  tokenId: number;

  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;

  from: string;
  to: string;
  value: string;
}) {
  return prisma.event.create({
    data: {
      contractId: data.contractId,
      tokenId: data.tokenId,

      blockNumber: data.blockNumber,
      blockHash: data.blockHash,
      txHash: data.txHash,
      logIndex: data.logIndex,

      eventName: "Transfer",
      fromAddress: data.from,
      toAddress: data.to,
      value: data.value,
    },
  });
}

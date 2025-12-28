import { prisma } from "./prisma";

export async function saveTransferEvent(data: {
  contractId: number;
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
/* Saves decoded Transfer event data to the database */

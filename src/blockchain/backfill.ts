import { ethers } from "ethers";
import { saveTransferEvent } from "../services/indexer";
import { getOrCreateToken } from "../services/tokens";

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export async function backfillTransfers(
  rpcUrl: string,
  contractAddress: string,
  contractId: number,
  fromBlock: number,
  toBlock: number | "latest" = "latest"
) {
  console.log("🔄 Starting backfill...");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const iface = new ethers.Interface(ERC20_ABI);

  const filter: ethers.Filter = {
    address: contractAddress,
    topics: [iface.getEvent("Transfer")!.topicHash],
    fromBlock,
    toBlock,
  };

  const logs = await provider.getLogs(filter);
  console.log(`📦 Found ${logs.length} historical Transfer events`);

  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log);
      if (!parsed) continue;

      const from = parsed.args.from.toLowerCase();
      const to = parsed.args.to.toLowerCase();
      const value = parsed.args.value;

      const token = await getOrCreateToken(provider, log.address);

      await saveTransferEvent({
        contractId,
        tokenId: token.id,

        blockNumber: log.blockNumber,
        blockHash: log.blockHash!,
        txHash: log.transactionHash!,
        logIndex: log.index,

        from,
        to,
        value: value.toString(),
      });
    } catch (err: any) {
      // 👇 duplicate protection
      if (err.code === "P2002") {
        continue;
      }

      console.error("❌ Backfill error:", err);
    }
  }

  console.log("✅ Backfill complete");
}

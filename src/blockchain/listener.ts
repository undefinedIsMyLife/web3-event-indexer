import { ethers, Log } from "ethers";
import { saveTransferEvent } from "../services/indexer";

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export function startTransferListener(
  rpcUrl: string,
  contractAddress: string,
  contractId: number
) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const iface = new ethers.Interface(ERC20_ABI);

  // ✅ Guaranteed because ABI is static
  const transferEvent = iface.getEvent("Transfer")!;
  const transferTopic = transferEvent.topicHash;

  const filter = {
    address: contractAddress,
    topics: [transferTopic],
  };

  console.log(`Listening for Transfer events on ${contractAddress}`);

  provider.on(filter, async (log: Log) => {
    try {
      const parsed = iface.parseLog(log);
      if (!parsed) return;

      const from = parsed.args.from as string;
      const to = parsed.args.to as string;
      const value = parsed.args.value as bigint;

      await saveTransferEvent({
        contractId,
        tokenId: 1,
        blockNumber: log.blockNumber!,
        blockHash: log.blockHash!,
        txHash: log.transactionHash!,
        logIndex: log.index!, // ✅ v6 field
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        value: value.toString(),
      });

      console.log("✅ Indexed tx:", log.transactionHash);
    } catch (err) {
      console.error("❌ Indexing error:", err);
    }
  });
}

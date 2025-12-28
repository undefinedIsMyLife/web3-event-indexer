import { ethers } from "ethers";
import { saveTransferEvent } from "../services/indexer";

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export function startTransferListener(
  rpcUrl: string,
  contractAddress: string,
  contractId: number
) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contract = new ethers.Contract(
    contractAddress,
    ERC20_ABI,
    provider
  );

  contract.on("Transfer", async (from, to, value, event) => {
    try {
      const log = event.log;

      if (!log) {
        console.warn("Missing log data, skipping event");
        return;
      }

      await saveTransferEvent({
        contractId,
        blockNumber: log.blockNumber,
        blockHash: log.blockHash,
        txHash: log.transactionHash,
        logIndex: log.index,
        from,
        to,
        value: value.toString(),
      });

      console.log(`Transfer indexed: ${log.transactionHash}`);
    } catch (err) {
      console.error("Indexing error:", err);
    }
  });

}


/* Connects to Ethereum via RPC

Subscribes to Transfer events

Decodes event parameters

Passes structured data to DB layer

Handles errors safely*/
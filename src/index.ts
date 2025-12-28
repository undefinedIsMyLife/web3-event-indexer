import "dotenv/config";
import { app } from "./app";
import { getOrCreateContract } from "./services/contracts";
import { startTransferListener } from "./blockchain/listener";

const PORT = process.env.PORT || 3000;


async function bootstrap() {
  const contract = await getOrCreateContract(
     "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // USDC Sepolia
      11155111, // Sepolia chainId
     "USDC-Sepolia"
  );

  startTransferListener(
    process.env.RPC_URL!,
    contract.address,
    contract.id
  );

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();


/*DB setup happens before listener

Contract metadata is persisted

Listener depends on DB state

Clean startup sequence*/
-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockHash" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "fromAddress" TEXT,
    "toAddress" TEXT,
    "value" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockNumber_key" ON "Block"("blockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_address_key" ON "Contract"("address");

-- CreateIndex
CREATE INDEX "Event_blockNumber_idx" ON "Event"("blockNumber");

-- CreateIndex
CREATE INDEX "Event_fromAddress_idx" ON "Event"("fromAddress");

-- CreateIndex
CREATE INDEX "Event_toAddress_idx" ON "Event"("toAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Event_txHash_logIndex_key" ON "Event"("txHash", "logIndex");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

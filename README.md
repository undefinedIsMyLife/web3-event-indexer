# Web3 ERC-20 Event Indexer & Analytics

A production-style backend service that indexes **ERC-20 Transfer events** from Ethereum-compatible networks and exposes **analytics APIs** such as volume, daily activity, and top addresses.

This project is designed as an **open-source starter** and **portfolio-grade example** of how to build a real-time blockchain indexer with clean analytics.

---

## 🚀 Features

* ✅ Real-time ERC-20 `Transfer` event indexing
* ✅ Safe, idempotent event storage (txHash + logIndex)
* ✅ Token decimal–aware volume normalization
* ✅ Analytics APIs:

  * Total transfer count
  * Total transferred volume
  * Daily transfer volume
  * Daily transfer count
  * Top senders
  * Top receivers
* ✅ Clean, frontend-ready API responses

---

## 🧱 Architecture Overview

```
Ethereum RPC
     │
     ▼
Ethers.js Listener
     │
     ▼
Indexer Service
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL / SQLite
     │
     ▼
Analytics Service
     │
     ▼
REST API (Express)
```

### Key Ideas

* **On-chain → Off-chain** data modeling
* **Decimals normalized at query-time**, not stored incorrectly
* **Analytics computed from indexed events**, not raw logs

---

## 📦 Tech Stack

* Node.js + TypeScript
* Express
* Ethers.js
* Prisma ORM
* PostgreSQL / SQLite
* Decimal.js (safe math)

---

## ⚙️ Setup & Run

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Environment variables

Create `.env`:

```env
DATABASE_URL="file:./dev.db"
RPC_URL="https://your-rpc-url"
CONTRACT_ADDRESS="0xYourERC20Contract"
```

### 3️⃣ Database setup

```bash
npx prisma migrate dev
```

### 4️⃣ Run the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## 📊 API Endpoints

### Analytics Overview

```
GET /analytics/transfers/:contractId
```

### Example Response

```json
{
  "contractId": 1,
  "stats": {
    "transferCount": 29,
    "totalVolume": "1325.90"
  },
  "dailyVolume": [
    { "date": "2026-01-12", "volume": "1325.80" }
  ],
  "dailyCount": [
    { "date": "2026-01-12", "count": 28 }
  ],
  "topSenders": [
    { "address": "0x...", "value": "662.40" }
  ],
  "topReceivers": [
    { "address": "0x...", "value": "662.40" }
  ]
}
```

---

## 🧪 How Indexing Works

* The blockchain listener subscribes to `Transfer` events
* Each log is parsed and validated
* Events are stored with:

  * `txHash`
  * `logIndex`
* This ensures **no duplicates** even across restarts

---

## ➕ How to Add Another Event

1. Add event ABI to the contract interface
2. Subscribe in `listener.ts`
3. Parse event arguments
4. Store in `event` table
5. Add analytics logic if needed

This architecture supports **any event type**, not just ERC-20.

---

## 🔮 Future Improvements (Optional)

* Historical backfill using `getLogs`
* Multiple contracts support
* WebSocket streaming API
* Frontend dashboard

---


## 📄 License

MIT

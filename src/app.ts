import express from "express";
import analyticsRoutes from "./routes/analytics";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/analytics", analyticsRoutes);

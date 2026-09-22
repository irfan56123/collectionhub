import "dotenv/config";
import express from "express";
import cors from "cors";

import { loanRoutes } from "./routes/loan.routes";
import { followUpRoutes } from "./routes/followup.routes";

const app = express();

const PORT = process.env.PORT ?? 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "CollectionHub API is running",
  });
});

app.use("/api/loans", loanRoutes);
app.use("/api", followUpRoutes);

// Local development
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `CollectionHub API running on http://localhost:${PORT}`
    );
  });
}

// Vercel
export default app;
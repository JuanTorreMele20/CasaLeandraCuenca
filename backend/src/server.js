import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(helmet());
app.use(express.json());

const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowed.length === 0) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api", publicRoutes);
app.use("/api", adminRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("API listening on", port));

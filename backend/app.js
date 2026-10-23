import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import attendeesRouter from "./routes/attendees.js";
import smsRouter from "./routes/sms.js";

const app = express();

/** Always allow production + local dev; extend via CLIENT_ORIGIN env (comma-separated). */
const DEFAULT_ORIGINS = [
  "https://future-linkservices.com",
  "https://www.future-linkservices.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = [
  ...new Set([
    ...DEFAULT_ORIGINS,
    ...(process.env.CLIENT_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]),
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Vercel production + preview deployments (*.vercel.app)
  if (/^https:\/\/[\w-]+\.vercel\.app$/i.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Serverless functions start cold, so make sure MongoDB is connected before any DB route runs.
app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(503).json({ error: "Database unavailable" });
  }
});

app.use("/api/attendees", attendeesRouter);
app.use("/api/sms", smsRouter);

export default app;

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import attendeesRouter from "./routes/attendees.js";

const app = express();
const PORT = process.env.PORT || 3001;

/** Always allow production + local dev; extend via CLIENT_ORIGIN env (comma-separated). */
const DEFAULT_ORIGINS = [
  "https://futurelinkservices.netlify.app",
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

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/attendees", attendeesRouter);

connectDB()
  .then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the other server or change PORT in .env`);
      } else {
        console.error(err);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });

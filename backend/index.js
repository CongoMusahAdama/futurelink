import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import attendeesRouter from "./routes/attendees.js";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors(
    allowedOrigins.length
      ? {
          origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
              return;
            }
            callback(new Error(`CORS blocked origin: ${origin}`));
          },
        }
      : undefined
  )
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

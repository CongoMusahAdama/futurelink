import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 3001;

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

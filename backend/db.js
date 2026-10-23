import mongoose from "mongoose";

// Reused across warm serverless invocations so each request doesn't open a new connection.
let connection = null;

export function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not set"));
  }
  if (!connection) {
    connection = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then((conn) => {
        console.log("MongoDB connected");
        return conn;
      })
      .catch((err) => {
        connection = null;
        throw err;
      });
  }
  return connection;
}

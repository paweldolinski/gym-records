// lib/mongoose.ts

import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder?.("ipv4first"); // 👈 pomaga, gdy IPv6/SRV bruździ
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false); // od razu pokaże realny błąd zamiast 10s bufora

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (global._mongooseConn) return global._mongooseConn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  global._mongooseConn = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000, // dobór serwera
      connectTimeoutMS: 5000, // nawiązanie TCP/TLS
      socketTimeoutMS: 10000, // I/O po połączeniu
    })
    .then((m) => {
      if (process.env.NODE_ENV !== "production") mongoose.set("debug", true);
      return m;
    })
    .catch((e) => {
      console.error(
        "Mongo connect fail:",
        e?.name,
        (e as any)?.code,
        e?.message,
      );
      global._mongooseConn = undefined; // pozwól próbować ponownie
      throw e;
    });

  return global._mongooseConn;
}

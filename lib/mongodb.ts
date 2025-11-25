import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder?.("ipv4first");
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (global._mongooseConn) return global._mongooseConn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  global._mongooseConn = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    })
    .then((m) => {
      if (process.env.NODE_ENV !== "production") mongoose.set("debug", true);
      return m;
    })
    .catch((e) => {
      console.error("Mongo connect fail:", e?.name, e?.code, e?.message);
      global._mongooseConn = undefined;
      throw e;
    });

  return global._mongooseConn;
}

import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not set. /api/jobs will operate with empty results until configured.");
    return null;
  }
  if (isConnected) return mongoose;
  try {
    await mongoose.connect(uri);
    isConnected = true;
    return mongoose;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    return null;
  }
}

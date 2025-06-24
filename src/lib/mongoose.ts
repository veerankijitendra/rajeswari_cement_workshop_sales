import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function dbConnect() {
  const readyState = mongoose.connection.readyState;
  if (readyState == 1) {
    console.info("MongoDB is already connected");
    return;
  }

  if (readyState == 2) {
    console.info("MongoDB is currently connecting");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.info("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default dbConnect;

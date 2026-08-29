import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please enter your mongodb connection url in your .env file!",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    console.log("Already connected to the Database!");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    console.log("Successfully connected to the Database!");
    return cached.conn;
  } catch (error) {
    console.error("Error connecting to the Database", error);
    cached.promise = null;
    throw error;
  }
}

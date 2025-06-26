import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/greenproof",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("📦 MongoDB Disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};

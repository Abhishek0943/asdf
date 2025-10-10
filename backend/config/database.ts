import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connectDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.DB_URI_PRO;
    if (!dbUri) {
      throw new Error("Database connection URI (DB_URI_PRO) is not defined in environment variables.");
    }

    await mongoose.connect(dbUri, { autoIndex: true });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit process on DB connection failure
  }
};

export default connectDatabase;

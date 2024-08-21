import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "SmartChatbot",
    });

    console.log("Database connected successfully");
  } catch (err) {
    console.log("Error", err);
  }
};

export default connectDB;

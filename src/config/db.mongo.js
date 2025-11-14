import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = "mongodb://127.0.0.1:27017/restaurant";


const runTest = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connecté avec succès !");
  } catch (err) {
    console.error("❌ Erreur MongoDB :", err.message);
  }
  process.exit();
};

runTest();

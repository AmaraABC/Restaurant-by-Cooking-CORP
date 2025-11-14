import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

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
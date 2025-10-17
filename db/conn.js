import mongoose from "mongoose";
import "dotenv/config";

export default async function connectDB() {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to db");
}
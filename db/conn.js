import mongoose from "mongoose";
import "dotenv/config";

await mongoose.connect(process.env.ATLAS_URI);
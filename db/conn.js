import mongoose from "mongoose";
import dotenv from "dotenv";

// Setup
dotenv.config();

// Connection string
const connectionString = process.env.mongoURI || "";

// Connection to DB
async function connectDB() {
  try {
    await mongoose.connect(connectionString);
    console.log(`Mongo DB connected`);
  } catch (error) {
    console.error(`Error - ${error.message}`);
  }
}

export default connectDB;

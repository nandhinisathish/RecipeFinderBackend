// Imports
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { globalErr, log } from "./middlewares/middleware.js";
import connectDB from "./db/conn.js";
import userRoutes from "./routes/userRoutes.js";
import favouriteRoutes from "./routes/favouriteRoute.js"
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"

// Set up
dotenv.config();

// Environment variables
const PORT = process.env.PORT || 3000;
const app = express();


// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(log);
app.use(cors());

// Routes
//app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/favourites',favouriteRoutes);

// Global error handling
app.use(globalErr);

// Server listener
app.listen(PORT, ()=>{

    console.log(`Server running on the PORT: ${PORT}`);

})


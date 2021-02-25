import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db";
import routes from "./routes";
import cors from "cors";

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; // for testing

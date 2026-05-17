import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config({ override: true });

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

const clientOrigin = process.env.CLIENT_URL?.replace(/\/+$/, "");
console.log("[Server] CORS origin:", clientOrigin || "(not set)");

app.use(
  cors({
    origin: clientOrigin || true,
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    console.log(`[Server] ${req.method} ${req.originalUrl}`);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI not set — database features disabled");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});

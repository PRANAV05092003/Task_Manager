import mongoose from "mongoose";

export const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error("[DB] Request blocked — MongoDB not connected");
    return res.status(503).json({
      message: "Database unavailable. Please try again shortly.",
    });
  }
  next();
};

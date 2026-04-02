import express from "express";
import helmet from "helmet";
// import mongoSanitize from 'express-mongo-sanitize'; // Not compatible with Express 5 currently
// import xss from "xss-clean"; // Not compatible with Express 5 currently
import hpp from "hpp";
import cors from "cors";
import morgan from "morgan";

import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middleware/errorMiddleware.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Added for extra compatibility
app.use(cors());
app.use(helmet()); 

app.use(hpp());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Finance Backend is running!" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Added for consistency with Postman base_url
app.use("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API v1 is active",
  });
});

app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;

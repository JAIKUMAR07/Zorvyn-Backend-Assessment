import express from "express";
import * as authController from "../controllers/authController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// PROTECTED ROUTES
router.get("/me", authMiddleware.protect, authController.getMe);

export default router;

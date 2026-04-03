import express from "express";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import filterObject from "../utils/filterObject.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("admin"));
// get all users
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const users = await User.find().select("+active");
    res.status(200).json({ status: "success", data: { users } });
  }),
);
//  update user status
router.patch(
  "/status/:id",
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("+active");
    if (!user) return next(new AppError("No user found", 404));
    let activeValue = req.body.active;
    if (typeof activeValue === "string") {
      if (activeValue.toLowerCase() === "true") activeValue = true;
      else if (activeValue.toLowerCase() === "false") activeValue = false;
    }
    if (typeof activeValue !== "boolean") {
      return next(new AppError('Field "active" must be a boolean.', 400));
    }
    user.active = activeValue;
    await user.save();
    res.status(200).json({ status: "success", data: { user } });
  }),
);

// Admin can update user role or details
router.patch(
  "/:id",
  catchAsync(async (req, res, next) => {
    const allowedFields = ["name", "email", "role", "active", "password"];
    const payload = filterObject(req.body, allowedFields);

    const user = await User.findById(req.params.id).select("+password +active");

    // conditions
    if (!user) return next(new AppError("No user found", 404));

    if (payload.name !== undefined) user.name = payload.name;
    if (payload.email !== undefined) user.email = payload.email;
    if (payload.role !== undefined) user.role = payload.role;
    if (payload.active !== undefined) user.active = payload.active;
    if (payload.password) user.password = payload.password;

    await user.save();
    user.password = undefined;
    res.status(200).json({ status: "success", data: { user } });
  }),
);

export default router;

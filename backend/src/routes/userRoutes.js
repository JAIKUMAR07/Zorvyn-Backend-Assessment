import express from 'express';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', catchAsync(async (req, res, next) => {
  const users = await User.find().select('+active');
  res.status(200).json({ status: 'success', data: { users } });
}));

router.patch('/status/:id', catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true });
  if (!user) return next(new AppError('No user found', 404));
  res.status(200).json({ status: 'success', data: { user } });
}));

// Admin can update user role or details
router.patch('/:id', catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
    new: true,
    runValidators: true 
  });
  if (!user) return next(new AppError('No user found', 404));
  res.status(200).json({ status: 'success', data: { user } });
}));

export default router;

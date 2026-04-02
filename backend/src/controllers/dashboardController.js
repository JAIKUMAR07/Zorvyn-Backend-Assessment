import mongoose from 'mongoose';
import Record from '../models/Record.js';
import catchAsync from '../utils/catchAsync.js';

export const getSummary = catchAsync(async (req, res, next) => {
  // If admin, we can see global stats. If not, only own stats.
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const matchStage = userId ? { user: new mongoose.Types.ObjectId(userId) } : {};

  const summary = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null, // Group all matching records into one bucket
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
      },
    },
  ]);

  const result = summary[0] || { totalIncome: 0, totalExpense: 0 };

  res.status(200).json({
    status: 'success',
    data: {
      income: result.totalIncome,
      expense: result.totalExpense,
      balance: result.totalIncome - result.totalExpense,
    },
  });
});

export const getCategoryStats = catchAsync(async (req, res, next) => {
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const matchStage = userId ? { user: new mongoose.Types.ObjectId(userId) } : {};

  const stats = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.status(200).json({ status: 'success', data: { stats } });
});

export const getRecentActivity = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.user.role !== 'admin') {
    filter = { user: req.user._id };
  }

  const records = await Record.find(filter).sort('-createdAt').limit(10);

  res.status(200).json({ status: 'success', data: { records } });
});

export const getTrends = catchAsync(async (req, res, next) => {
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const matchStage = userId ? { user: new mongoose.Types.ObjectId(userId) } : {};

  const stats = await Record.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          year: { $year: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  res.status(200).json({ status: 'success', data: { stats } });
});

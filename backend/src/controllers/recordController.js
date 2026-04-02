import Record from '../models/Record.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllRecords = catchAsync(async (req, res, next) => {
  let filter = {};
  
  // Role-Based Behavior: Viewer/Analyst see OWN, Admin sees ALL
  if (req.user.role !== 'admin') {
    filter = { user: req.user._id };
  }

  // Basic filters
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;

  // ✅ Search Functionality (Case-insensitive description search)
  if (req.query.search) {
    filter.description = { $regex: req.query.search, $options: 'i' };
  }

  // Date filtering
  if (req.query.fromDate) {
    filter.date = { ...filter.date, $gte: new Date(req.query.fromDate) };
  }
  if (req.query.toDate) {
    filter.date = { ...filter.date, $lte: new Date(req.query.toDate) };
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Execute Query
  const records = await Record.find(filter)
    .populate('user', 'name email') // Matching your example (2.2)
    .sort('-date')
    .skip(skip)
    .limit(limit);

  const total = await Record.countDocuments(filter);

  // Response Format Matching Example 2.2
  res.status(200).json({
    status: 'success',
    results: records.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      records
    }
  });
});

export const getRecord = catchAsync(async (req, res, next) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    return next(new AppError('No record found with that ID', 404));
  }

  // Security check: cannot view other's records unless admin
  if (req.user.role !== 'admin' && record.user.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to view this record', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  });
});

export const createRecord = catchAsync(async (req, res, next) => {
  // As per your plan: Only Admin can create
  // (Middleware handles the role check, this ensures the user is assigned correctly)
  if (!req.body.user) req.body.user = req.user._id;

  const newRecord = await Record.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      record: newRecord
    }
  });
});

export const updateRecord = catchAsync(async (req, res, next) => {
  // As per your plan: Only Admin can update
  const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedRecord) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      record: updatedRecord
    }
  });
});

export const deleteRecord = catchAsync(async (req, res, next) => {
  // As per your plan: Only Admin can delete
  const record = await Record.findByIdAndDelete(req.params.id);

  if (!record) {
    return next(new AppError('No record found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

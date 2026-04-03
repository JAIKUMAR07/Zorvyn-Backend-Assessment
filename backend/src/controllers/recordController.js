import Record from '../models/Record.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import escapeRegExp from '../utils/escapeRegExp.js';
import filterObject from '../utils/filterObject.js';

const CREATE_FIELDS = ['amount', 'type', 'category', 'description', 'date', 'user'];
const UPDATE_FIELDS = ['amount', 'type', 'category', 'description', 'date'];

export const getAllRecords = catchAsync(async (req, res, next) => {
  let filter = {};
  
  // Role-Based Behavior: Viewer/Analyst see OWN, Admin sees ALL
  if (req.user.role !== 'admin') {
    filter = { user: req.user._id };
  }

  // Basic filters
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;

  // Search Functionality (Case-insensitive description search)
  if (req.query.search) {
    const safeSearch = escapeRegExp(req.query.search);
    filter.description = { $regex: safeSearch, $options: 'i' };
  }

  // Date filtering
  if (req.query.fromDate) {
    filter.date = { ...filter.date, $gte: new Date(req.query.fromDate) };
  }
  if (req.query.toDate) {
    filter.date = { ...filter.date, $lte: new Date(req.query.toDate) };
  }

  // Pagination
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);
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
  const payload = filterObject(req.body, CREATE_FIELDS);
  if (!payload.user) payload.user = req.user._id;

  const newRecord = await Record.create(payload);

  res.status(201).json({
    status: 'success',
    data: {
      record: newRecord
    }
  });
});

export const updateRecord = catchAsync(async (req, res, next) => {
  // As per your plan: Only Admin can update
  const payload = filterObject(req.body, UPDATE_FIELDS);
  const updatedRecord = await Record.findByIdAndUpdate(req.params.id, payload, {
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

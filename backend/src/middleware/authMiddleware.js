import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Robust split to handle multiple spaces
    token = req.headers.authorization.replace(/\s+/g, ' ').split(' ')[1];
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('--- Auth Debug ---');
    console.log('Full Header Received:', `[${req.headers.authorization}]`);
    console.log('Token Length:', token ? token.length : 0);
    console.log('Starts with:', token ? token.substring(0, 10) : 'N/A');
    console.log('Ends with:', token ? token.substring(token.length - 10) : 'N/A');
  }

  if (!token || token === 'undefined' || token === 'null' || token === '') {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Detect Unresolved Postman Variables
  if (token.startsWith('{{') && token.endsWith('}}')) {
    return next(new AppError('Postman Variable Error: You are sending the literal text "{{auth_token}}"! Make sure your Postman Environment is selected and your variable is set.', 401));
  }

  // Detect basic JWT structure (at least two dots)
  if (token.split('.').length !== 3) {
    return next(new AppError('The token you provided is not a valid JWT (it must have 3 parts). Please re-login and copy the full token.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select('+active');
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  if (currentUser.active === false) {
    return next(new AppError('This user account is inactive. Please contact support.', 403));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

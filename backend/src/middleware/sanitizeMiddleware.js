// for sanitize  the request body  for mongo injection
const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
};

const sanitizeInPlace = (obj) => {
  if (!obj || typeof obj !== "object") return;
  const sanitized = sanitizeValue(obj);
  // Clear the original object without replacing its reference
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      delete obj[key];
    }
  }
  // Re-assign the clean values
  Object.assign(obj, sanitized);
};

// apply this middleware to all the routes
const sanitizeMiddleware = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body); // req.body is usually safe to replace
  if (req.query) sanitizeInPlace(req.query);
  if (req.params) sanitizeInPlace(req.params);
  next();
};

export default sanitizeMiddleware;

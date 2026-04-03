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

// apply this middleware to all the routes
const sanitizeMiddleware = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

export default sanitizeMiddleware;

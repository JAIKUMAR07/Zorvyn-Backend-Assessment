const filterObject = (obj = {}, allowedFields = []) => {
  const filtered = {};
  for (const [key, value] of Object.entries(obj)) {
    if (allowedFields.includes(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
};

export default filterObject;

//  to escape special characters in a string

const escapeRegExp = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export default escapeRegExp;

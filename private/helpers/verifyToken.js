/* eslint-disable */
const jwt = require("jsonwebtoken");

// checks if the request has a header of auth-token which is the token of the logged-in user
const verify = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

module.exports = {
  verify,
};

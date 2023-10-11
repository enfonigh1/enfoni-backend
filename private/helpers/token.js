const jwt = require("jsonwebtoken");
async function generateTokens(user) {
  try {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "14m",
    });
    return accessToken;
  } catch (error) {
    throw error;
  }
}

module.exports = generateTokens;

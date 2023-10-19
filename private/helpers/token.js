/* eslint-disable */
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserToken = require("../schema/UserToken");

const verifyRefreshToken = (refreshToken) => {
  const privateKey = process.env.JWT_SECRET;

  return new Promise((resolve, reject) => {
    UserToken.findOne({ token: refreshToken }, (err, doc) => {
      if (!doc)
        return reject({ error: true, message: "Invalid refresh token" });

      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err)
          return reject({ error: true, message: "Invalid refresh token" });

        resolve({
          tokenDetails,
          error: false,
          message: "Valid refresh token",
        });
      });
    });
  });
};

async function generateTokens(user) {
  try {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    const userToken = await UserToken.findOne({ user_id: user._id });
    // if (userToken) await userToken.remove();

    await new UserToken({ user_id: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  verifyRefreshToken,
  generateTokens,
};

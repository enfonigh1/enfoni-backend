const bcrypt = require("bcrypt"); // encrypting the password

module.exports = encryptPassword = (password) => {
  // encrypt password
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

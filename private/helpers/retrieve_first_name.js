/* eslint-disable */

const User = require("../schema/User");

// const User = require("../schemas/User");

/**
 * Retrieves the name of a user, staff using email
 * if the email is not found in the users
 * then it checks in the staff collection
 * @param {String} email
 * @returns {String} first_name - a user or staff email
 * @returns {String} empty string When an error occurs
 */
async function getFirstName(email) {
  let first_name = "";
  try {
    let result = await User.find({ email });
    // console.log(result)

    if (result !== null) {
      first_name = result[0]?.full_name;
    }
    return first_name;
  } catch (error) {
    return first_name;
  }
}

module.exports = getFirstName;

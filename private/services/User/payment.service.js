const axios = require("axios");
const User = require("../../schema/User");
require("dotenv").config();
const { faker } = require("@faker-js/faker")

async function payment(req) {
  const { provider, phone, amount } = req.body; // Corrected destructuring
  console.log(req?.body)
  try {
    const response = await axios.post("https://api.paystack.co/charge", {
      amount: amount * 100,
      email: faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName() }),
      currency: "GHS",
      mobile_money: {
        phone: phone,
        provider: provider
      }
    }, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });

    return { ...response?.data }; // Log the response data for debugging
  } catch (error) {
    return { ...error?.response?.data }; // Log the error response for debugging
  }
}

// OTP
async function SubmitOtp(req) {
  const { otp, reference } = req.body; // Corrected destructuring

  try {
    const response = await axios.post("https://api.paystack.co/charge/submit_otp", {
      otp: otp,
      reference: reference
    }, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });

    return { ...response.data }; // Log the response data for debugging
  } catch (error) {
    return { ...error.response.data }; // Log the error response for debugging
  }
}


// OTP
async function checkPaymentStatus(req) {
  const { reference, id } = req.body; // Corrected destructuring

  try {
    const response = await axios.get(`https://api.paystack.co/charge/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });
    const results = await User.updateOne({ _id: id }, { ...req?.body })
    if (results) {

      return { ...response?.data }; // Log the response data for debugging
    }

  } catch (error) {
    return { ...error.response.data }; // Log the error response for debugging
  }
}

async function userInfo(req, res) {
  console.log(req?.params?.user_id)
  return res.json({ message: "Hello" })
}


async function fetchAllUsers(req, res) {

  try {
    const results = await User.find();
    return res.json({ status: 200, data: results });
  } catch (error) {

  }
}
async function fetchSingleUser(req, res) {
  const id = req?.body?.id;
  try {
    const results = await User.find({ _id: id });
    return res.json({ status: 200, data: results[0] });
  } catch (error) {

  }
}

module.exports = { payment, userInfo, fetchAllUsers, fetchSingleUser, SubmitOtp, checkPaymentStatus };

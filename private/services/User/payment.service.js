const axios = require("axios");
const User = require("../../schema/User");
require("dotenv").config();

async function payment(req) {
  const { provider, phone, amount, full_name, frame } = req.body; // Corrected destructuring
  console.log(req?.body)
  // const random = Math.random()
  try {
    const response = await axios.post("https://api.paystack.co/charge", {
      amount: amount * 100,
      email: "info@enfonigh.com",
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


// OTP SELECT FRAME
async function checkPaymentStatus(req) {
  const { reference, payerinfo } = req.body; // Corrected destructuring
  console.log(req?.body)

  try {
    const response = await axios.get(`https://api.paystack.co/charge/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });
    const results = await new User({
      full_name: payerinfo?.full_name,
      phone_number: payerinfo?.phone,
      frame: payerinfo?.frames
    })
    const saveUser = results.save()
    if (saveUser) {

      return { data: results, status: 200 }; // Log the response data for debugging
    }

  } catch (error) {
    return { ...error.response.data }; // Log the error response for debugging
  }
}


// SAME DAY BOOKIING 
async function checkPaymentStatusSame(req) {
  const { reference, id, full_name, frame } = req.body; // Corrected destructuring

  try {
    const response = await axios.get(`https://api.paystack.co/charge/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });
    const results = await User.create({ full_name: full_name, phone_number: phone, frame: frame })
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

module.exports = { payment, userInfo, fetchAllUsers, fetchSingleUser, SubmitOtp, checkPaymentStatus, checkPaymentStatusSame };

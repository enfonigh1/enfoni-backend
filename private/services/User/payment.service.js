const axios = require("axios");
const User = require("../../schema/User");
const Usher = require("../../schema/Usher");
require("dotenv").config();
const mongoose = require("mongoose")

async function payment(req) {
  const { provider, phone, amount, full_name, frame } = req.body; // Corrected destructuring
  console.log(req?.body)
  // const random = Math.random()
  try {
    let randomNumber = Math.floor(Math.random() * 900) + 1
    const response = await axios.post("https://api.paystack.co/charge", {
      amount: amount * 100,
      email: `info${randomNumber}@enfonigh.com`,
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

    return { ...response.data, status: 200 }; // Log the response data for debugging
  } catch (error) {
    return { ...error.response.data, status: 400 }; // Log the error response for debugging
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
    console.log(response)
    const results = await new User({
      full_name: payerinfo?.full_name,
      phone_number: payerinfo?.phone,
      frame: payerinfo?.frames
    })
    if (response?.data?.data?.status !== "success") {
      return { message: "Please complete payment", status: 400 }
    }
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
  const { reference, payerinfo } = req.body; // Corrected destructuring

  try {
    const response = await axios.get(`https://api.paystack.co/charge/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });
    // const results = await User.create({ full_name: full_name, phone_number: phone, frame: frame })
    // const increaseUsherCheckins = await Usher.findOne(code, { $inc: { checkins: 2 } })
    const results = await new User({
      full_name: payerinfo?.full_name,
      phone_number: payerinfo?.phone,
      frame: payerinfo?.frames
    })
    if (response?.data?.data?.status !== "success") {
      return { message: "Please complete payment", status: 400 }
    }
    const saveUser = results.save()
    if (saveUser && increaseUsherCheckins) {

      return { data: results, status: 200 }; // Log the response data for debugging
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

async function usherCheckins(req, res) {
  const { code } = req?.body;
  try {
    if (!code || code.length < 6) {
      return { status: 400, message: 'Code must be at least 6 characters long' };
    }

    // Convert the first 6 characters of 'code' into a MongoDB ObjectId
    // const objectIdPrefix = code.slice(0, 6);
    const objectId = new mongoose.Types.ObjectId(code);

    // Find users whose ObjectId starts with the first 6 characters of 'code'
    const results = await User.find({
      _id: { $gte: objectId, $lt: objectId + 1 }
    });

    if (results.length === 0) {
      return { status: 404, message: 'No matching users found' };
    }

    // Map the results to return only the necessary user data
    const data = results.map(item => ({
      id: item._id,
      username: item.username,
      // Add more fields as needed
    }));

    return { data };
  } catch (error) {
    return { status: 500, message: error?.message };
  }
}

module.exports = { payment, userInfo, usherCheckins, fetchAllUsers, fetchSingleUser, SubmitOtp, checkPaymentStatus, checkPaymentStatusSame };

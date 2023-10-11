const axios = require("axios");
require("dotenv").config();

async function payment(req) {
  const { email, amount } = req.body; // Corrected destructuring
  const params = {
    email: email,
    amount: amount * 100,
    currency: "GHS",
    channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
  };
  const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize", // Corrected URL
      params,
      { headers }
    );
    return { ...response?.data }; // Use response.data to access the response body
  } catch (error) {
    console.error(error);
  }
}

async function verifyPaystackTransaction(reference) {
    const headers = {
      Authorization: "Bearer sk_test_d77ee1491d65f0139a0d0018e7f7f4c0a3500f94",
      "Content-Type": "application/json",
      "cache-control": "no-cache",
    };
  
    const options = {
      headers,
    };
  
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          options,
          (response) => {
            let responseData = "";
  
            response.on("data", (chunk) => {
              responseData += chunk;
            });
  
            response.on("end", () => {
              resolve(responseData);
            });
          }
        )
        .on("error", (error) => {
          reject(error);
        });
    });
  }

module.exports = { payment };

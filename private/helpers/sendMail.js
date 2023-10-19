/* eslint-disable */
const nodemailer = require("nodemailer");
require("dotenv").config()

const sendMail = (email, mailBody) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.forwardemail.net",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      // secure: true,
      // tls: {
      //   servername: "gmail.com",
      // },
    });

    // write a function to send the mail


    const mailOptions = {
      from: "ENFONI GH replyus.app@gmail.com",
      to: email,
      subject: "ENFONI GH",
      html: mailBody,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(error);
      }
      resolve("ok");
    });
  });

module.exports = sendMail;

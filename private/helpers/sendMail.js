/* eslint-disable */
const nodemailer = require("nodemailer");

const sendMail = (email, mailBody) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "aopoku255@gmail.com",
        pass: "Prof...0545098438",
      },
      //   secure: true,
      //   tls: {
      //     servername: "gmail.com",
      //   },
    });

    const mailOptions = {
      from: "aopoku255@gmail.com",
      to: `${email}`,
      subject: "enfoni",
      text: mailBody,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(error);
      }
      resolve("ok");
    });
  });

module.exports = sendMail;

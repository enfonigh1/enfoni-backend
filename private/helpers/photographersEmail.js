/* eslint-disable */
const nodemailer = require("nodemailer");
require("dotenv").config()

const photographerSender = (email, mailBody) =>
    new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: "mail.enfonigh.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SENDER_EMAIL2,
                pass: process.env.EMAIL_PASS,
            },

        });

        // write a function to send the mail


        const mailOptions = {
            from: "ENFONI GH <register@enfonigh.com>",
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

module.exports = photographerSender;

require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.admin = admin;

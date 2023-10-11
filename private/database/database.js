const mongoose = require("mongoose");
require("dotenv").config();

module.exports = (db_name) => {
  return mongoose
    .connect(`${process.env.MONGODB_URI}/${db_name}`)
    .then((res) => console.log("MONGODB CONNECTED"))
    .catch((err) => console.log("AN ERROR OCCURED WHEN CONNECTING TO MONGODB"));
};

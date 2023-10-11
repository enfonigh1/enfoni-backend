const mongoose = require("mongoose");

const userCode = new mongoose.Schema(
  {
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usercode", userCode);

const mongoose = require("mongoose");

const userFrame = new mongoose.Schema(
  {
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
    },
    image: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    college_name: {
      type: String,
      required: true,
    },
    student_id: {
      type: String,
      required: true,
    },
    frame_price: {
      type: Number,
      required: true,
    },
    number_of_photos: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userframe", userFrame);

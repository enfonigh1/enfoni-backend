const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    college_name: {
      type: String,
      required: false,
    },
    session: {
      type: String,
      required: false,
    },
    faculty: {
      type: String,
      required: false,
    },

    gown: {
      type: Boolean,
      required: false,
    },
    photoshoot: {
      type: Boolean,
      required: false,
    },


    // student_id: {
    //   type: String,
    //   required: false,
    // },
    phone_number: {
      type: String,
      required: false,
    },
    date_of_graduation: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    gown_collection: {
      type: Boolean,
      required: false,
    },
    gown_returned: {
      type: Boolean,
      required: false,
    },
    photo_taken: {
      type: Boolean,
      required: false,
    },
    photo_collected: {
      type: Boolean,
      required: false,
    },

    payment_made: {
      type: Number,
      required: false,
    },
    delivery: {
      type: Boolean,
      required: false,
      default: false,
    },
    date_of_birth: {
      type: Date,
      required: false,
    },
    verified: {
      type: Boolean,
      required: false,
      default: false
    },
    admin: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);

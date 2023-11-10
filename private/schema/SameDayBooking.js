const { default: mongoose } = require("mongoose");

const sameDayBookingSchema = new mongoose.Schema({
    full_name: {
        type: String,
        require: false,
    },
    code: {
        type: String,
        require: false,
    },
    usher: {
        type: String,
        require: false,
    },
    booked: {
        type: Boolean,
        require: false
    },
   
    frame: {}
}, { timestamps: true })

module.exports = mongoose.model("samedaybooking", sameDayBookingSchema)
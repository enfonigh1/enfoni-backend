const { default: mongoose } = require("mongoose");

const usherSchema = new mongoose.Schema({
    full_name: {
        type: String,
        require: false,
    },
    code: {
        type: String,
        require: false,
    },
    checkins: {
        type: Number,
        require: false,
        default: 0,
    },
    paired_photographer: {
        type: mongoose.SchemaTypes.ObjectId,
        require: false
    }
}, { timestamps: true })

module.exports = mongoose.model("usher", usherSchema)
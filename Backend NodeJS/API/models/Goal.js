const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    repeats: {
        type: Number,
        required: false,
        default: 0
    },
    desiredRepeats: {
        type: Number,
        required: false
    },
    startDate: {
        type: Date,
        required: false,
        default: new Date()
    },
    desiredEndDate: {
        type: Date,
        required: false
    }
})

Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
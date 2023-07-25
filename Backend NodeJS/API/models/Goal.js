const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = Schema({
    userId: {
        type: mongoose.ObjectId,
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
        default: Date.now
    },
    desiredEndDate: {
        type: Date,
        required: false
    },
    dateCompleted: {
        type: Date,
        required: false
    },
    timeConversionRatio: {
        type: Number,
        required: false
    }
})

Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
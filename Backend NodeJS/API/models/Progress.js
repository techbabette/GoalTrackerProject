const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressSchema = Schema({
    //Redundant field for future faster reading speed (Showing users all their progress)
    userId:{
        type: mongoose.ObjectId,
        required: true
    },
    goalId:{
        type: mongoose.ObjectId,
        required: true
    },
    repeats:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: false,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    }
})

Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
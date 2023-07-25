const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserActivationLinkSchema = Schema({
    userId:{
        type: String,
        required: true
    },
    activationHash: {
        type: String,
        required: true
    },
    issuedAt: {
        type: Date,
        required: false,
        default: Date.now
    }
})

UserActivationLink = mongoose.model("UserActivationLink", UserActivationLinkSchema);

module.exports = UserActivationLink;
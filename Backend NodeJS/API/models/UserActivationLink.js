const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserActivationLinkSchema = Schema({
    userId:{
        type: mongoose.ObjectId,
        required: true
    },
    activationHash: {
        type: String,
        required: true
    },
    type:{
        type: String,
        default: "activation"
    },
    issuedAt: {
        type: Date,
        required: false,
        default: Date.now
    }
})

UserActivationLink = mongoose.model("UserActivationLink", UserActivationLinkSchema);

module.exports = UserActivationLink;
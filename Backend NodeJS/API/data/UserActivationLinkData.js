let UserActivationLinkModel = require("../models/UserActivationLink.js");
let crypto = require("crypto");

class UserActivationLinkData{
    static async createActivationHash(userId, type = "activation"){
        let activationHash = crypto.randomBytes(20).toString("hex");
        await UserActivationLinkModel.create({userId, activationHash, type});
        return activationHash;
    }
    static async deleteActivationHash(userId){
        await UserActivationLinkModel.deleteMany({userId});
    } 
}

module.exports = UserActivationLinkData;
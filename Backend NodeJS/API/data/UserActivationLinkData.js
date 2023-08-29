let UserActivationLinkModel = require("../models/UserActivationLink.js");
let crypto = require("crypto");

class UserActivationLinkData{
    static async createActivationHash(userId){
        let activationHash = crypto.randomBytes(20).toString("hex");
        await UserActivationLinkModel.create({userId, activationHash});
        return activationHash;
    }
    static async deleteActivationHash(userId){
        await UserActivationLinkModel.deleteMany({userId});
    } 
}

module.exports = UserActivationLinkData;
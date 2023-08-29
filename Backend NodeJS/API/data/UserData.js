let UserModel = require("../models/User.js");
let UserActivationLinkModel = require("../models/UserActivationLink.js");
let bcrypt = require("bcryptjs");
let crypto = require("crypto");

class UserData {
    static async createUser(userObject){
        let {username, password, email} = userObject;

        password = await bcrypt.hash(password, 10);

        let newUser = await UserModel.create({username, password, email});

        return newUser;
    }
    static async createActivationHash(userId){
        let activationHash = crypto.randomBytes(20).toString("hex");
        return await UserActivationLinkModel.create({userId, activationHash});
    }
}

module.exports = UserData;
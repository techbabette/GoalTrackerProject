let UserModel = require("../models/User.js");
let bcrypt = require("bcryptjs");

class UserData {
    static async createUser(userObject){
        let {username, password, email} = userObject;

        password = await bcrypt.hash(password, 10);

        let newUser = await UserModel.create({username, password, email});

        return newUser;
    }
    static async activateUser(userObject){
        userObject.activated = true;
        await userObject.save();
    }
    static async findUserById(userId){
        console.log(userId);
        let user = await UserModel.findById(userId);
        return user;
    }
}

module.exports = UserData;
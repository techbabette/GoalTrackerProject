let UserModel = require("../models/User.js");
let UserActivationLinkModel = require("../models/UserActivationLink.js");
let BaseService =  require("./BaseService.js");

let bcrypt = require("bcryptjs");

const JWT = require("jsonwebtoken");

class UserService extends BaseService{
    static passwordChecks = [
        {
            test : function(text){
                return text.length >= 6;
            },
            message : "Password must be at least six characters long"
        },
        {
            test : function(text){
                let regex = /[0-9]/
                return regex.test(text);
            },
            message : "Password must contain a number"
        },
        {
            test : function(text){
                let regex = /[A-Z]/
                return regex.test(text);
            },
            message : "Password must contain at least one uppercase letter"
        },
        {
            test : function(text){
                let regex = /[a-z]/
                return regex.test(text);
            },
            message : "Password must contain at least one lowercase letter"
        },
        {
            test : function(text){
                let regex = /^[A-Za-z0-9!\.\$]{6,}$/
                return regex.test(text);
            },
            message : 'Password can only contain characters A-Z, digits and "!" "." and "$"'
        }
    ]

    static usernameChecks = [
        {
            test : function(text){
                let regex = /^[A-Za-z0-9]{3,30}$/
                return regex.test(text);
            },
            message : "Username can only contain digits and alphabet letters and must be three to thirty characters long"
        }
    ]

    static emailChecks = [
        {
            test : function(text){
                let regex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
                return regex.test(text);
            },
            message : "Invalid email"
        },
        {
            test : function(text){
                return !(text.length > 254);
            },
            message : "Invalid email"
        },
        {
            test : function(text){
                let parts = text.split("@");
                return !(parts[0].length > 64);
            },
            message : "Invalid email"
        },
        {
            test : function(text){
                let domainParts = text.split("@")[1].split(".");

                return !(domainParts.some(part => part.length > 63));
            },
            message : "Invalid email"
        }
    ]

    static async createUser (userInformation){
        let responseObject = this.createResponseObject();
        let {username, password, repeatPassword, email} = userInformation;

        //Data validation

        await this.runTests(this.usernameChecks, username, responseObject, "usernameError");
        if(responseObject.success === false) return responseObject;

        await this.runTests(this.passwordChecks, password, responseObject, "passwordError");
        if(responseObject.success === false) return responseObject;

        await this.runTests(this.emailChecks, email, responseObject, "emailError");
        if(responseObject.success === false) return responseObject;

        if(password !== repeatPassword){
            responseObject.message = "Passwords must match";
            responseObject.errors.repeatPasswordError = "Passwords must match";
            responseObject.success = false;
            return responseObject;
        }

        let existingUser = await UserModel.findOne({email});

        if(existingUser){
            responseObject.message = "User with this email already exists";
            responseObject.errors.emailError = "User with this email already exists";
            responseObject.success = false;
            return responseObject;
        }

        responseObject.message = "Successfully created user";
        responseObject.success = true;
        return responseObject;
    }
    static async activateUser (activationHash){
        let responseObject = {};

        let userToActivate;

        let databaseActivationHash = await UserActivationLinkModel.findOne({activationHash, type: "activation"})

        if(databaseActivationHash){
            userToActivate = await UserModel.findById(databaseActivationHash.userId);
        }

        if(!userToActivate){
            responseObject.message = "Invalid activation hash";
            responseObject.success = false;
            return responseObject;
        }

        responseObject.message = "Successfully activated account";
        responseObject.success = true;
        responseObject.body = userToActivate
        return responseObject;
    }
    static createToken(userInformation, expiresIn = "6h"){
        return JWT.sign(userInformation, process.env.TOKEN_KEY, {expiresIn});
    }
    static async authenticateUser (userInformation) {
        let responseObject = {};
        responseObject.errors = {};
        let {email, password} = userInformation;

        //All database interactions are wrapped in a try catch block (attemptExecution)
        let user = await UserModel.findOne({email});

        if(!user){
            responseObject.message = "No user with that email exists";
            responseObject.errors.emailError = "No user with that email exists";
            responseObject.success = false;
            return responseObject;
        }

        if(!user.activated){
            responseObject.message = "You must confirm your email first";
            responseObject.errors.emailError = "You must confirm your email first";
            responseObject.success = false;
            return responseObject;
        }

        let passwordIsCorrect = await bcrypt.compare(password, user.password);

        if(!passwordIsCorrect){
            responseObject.message = "Incorrect password";
            responseObject.errors.passwordError = "Incorrect password";
            responseObject.success = false;
            return responseObject;
        }

        //If authentication runs into no errors
        responseObject.body = user;
        responseObject.message = "Successfully authenticated user";
        responseObject.success = true;
        return responseObject;
    }
    static async resetPassword (resetHash, password){
        let responseObject = this.createResponseObject();

        let userToReset;

        let resetHashExists = await UserActivationLinkModel.findOne({resetHash, type: "reset"});

        if(resetHashExists){
            userToReset = await UserModel.findById(resetHashExists.userId);
        }

        if(!userToReset){
            responseObject.message = "Invalid password reset hash";
            responseObject.success = false;
            return responseObject;
        }

        await this.runTests(this.passwordChecks, password, responseObject, "passwordError");
        if(responseObject.success === false) return responseObject;

        responseObject.message = "Valid reset hash";
        responseObject.success = true;
        responseObject.body = userToReset;
    }
}

module.exports = UserService
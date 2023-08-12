let UserModel = require("../models/User.js");
let UserActivationLinkModel = require("../models/UserActivationLink.js");
let BaseService =  require("./BaseService.js");

let NodeMailer = require("nodemailer");

let bcrypt = require("bcryptjs");
let crypto = require("crypto");

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
        let responseObject = {};
        responseObject.errors = {};
        let {username, password, repeatPassword, email} = userInformation;

        //Data validation

        for(let usernameCheck of this.usernameChecks){
            if(!usernameCheck.test(username)){
                responseObject.message = usernameCheck.message;
                responseObject.errors.usernameError = usernameCheck.message;
                responseObject.success = false;
                return responseObject;
            }
        }

        for(let passwordCheck of this.passwordChecks){
            if(!passwordCheck.test(password)){
                responseObject.message = passwordCheck.message;
                responseObject.errors.passwordError = passwordCheck.message;
                responseObject.success = false;
                return responseObject;
            }
        }

        for(let emailCheck of this.emailChecks){
            if(!emailCheck.test(email)){
                responseObject.message = emailCheck.message;
                responseObject.errors.emailError = emailCheck.message;
                responseObject.success = false;
                return responseObject;
            }
        }

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

        password = await bcrypt.hash(password, 10);

        let transporter = NodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let activationHash = crypto.randomBytes(20).toString("hex");

        //Temporary, should lead to frontend application
        let activationLink = `${process.env.ACTIVATION_URL}${activationHash}`; 

        let mail = {
            from: "GoalTracker@gmail.com",
            to: email,
            subject: "Your GoalTracker activation link",
            html: `<h1>Welcome to GoalTracker ${username}</h1><a href="${activationLink}">Click me to activate your account!</a>`
        };

        //Creating a new user if all data checks pass, attemptExecution wraps the function in a try catch block
        let newUser = await UserModel.create({username, password, email});
        await UserActivationLinkModel.create({userId: newUser._id, activationHash})
        await transporter.sendMail(mail);

        responseObject.message = "Successfully created user";
        responseObject.success = true;
        return responseObject;
    }
    static async activateUser (activationHash){
        let responseObject = {};

        let userToActivate;

        let databaseActivationHash = await UserActivationLinkModel.findOne({activationHash})

        if(databaseActivationHash){
            userToActivate = await UserModel.findById(databaseActivationHash.userId);
        }

        if(!userToActivate){
            responseObject.message = "Invalid activation hash";
            responseObject.success = false;
            return responseObject;
        }

        userToActivate.activated = true;

        await UserActivationLinkModel.deleteOne({_id: databaseActivationHash._id});
        await userToActivate.save();
        responseObject.message = "Successfully activated account";
        responseObject.success = true;
        return responseObject;
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
        let returnToken = JWT.sign({user_id: user._id, username:user.username}, process.env.TOKEN_KEY, {expiresIn: "6h"});

        responseObject.body = returnToken;
        responseObject.message = "Successfully authenticated user";
        responseObject.success = true;
        return responseObject;
    }
}

module.exports = UserService
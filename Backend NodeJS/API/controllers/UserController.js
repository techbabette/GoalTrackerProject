let UserModel = require("../models/User.js");
let UserActivationLinkModel = require("../models/UserActivationLink.js");
let BaseController =  require("./BaseController.js");
let NodeMailer = require("nodemailer");

let bcrypt = require("bcryptjs");
let crypto = require("crypto");

const JWT = require("jsonwebtoken");

class UserController extends BaseController  {
    static async getGreeting (req, res) {
        res.send("Hello user");
    }
    static async createUser (req, res){
        let {username, password, repeatPassword, email} = req.body;

        //Data validation

        if(password !== repeatPassword){
            res.status(400);
            res.json({error: "Passwords must match"});
            return;
        }

        //All database interactions are wrapped in a try catch block (attemptExecution)
        let existingUser = await UserController.attemptExecution(async()=>{
            return await UserModel.findOne({email});
        })

        if(existingUser){
            res.status(409);
            res.json({error : "User with this email already exists"});
            return;
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
        let activationLink = `${req.protocol}://${req.get('host')}/users/activate/${activationHash}`; 

        let mail = {
            from: "GoalTracker@gmail.com",
            to: email,
            subject: "Your GoalTracker activation link",
            html: `<h1>Welcome to GoalTracker ${username}</h1><a href="${activationLink}">Click me to activate your account!</a>`
        };

        //Creating a new user if all data checks pass, attemptExecution wraps the function in a try catch block
        UserController.attemptExecution(async()=>{
            let newUser = await UserModel.create({username, password, email});
            await UserActivationLinkModel.create({userId: newUser._id, activationHash})
            await transporter.sendMail(mail);
            res.status(201);
            res.json({message: "Successfully created user"});
        })
    }
    static async activateUser(req, res){
        let requestedActivationHash = req.params.activationHash;

        let databaseActivationHash;

        let userToActivate = await UserController.attemptExecution(async()=>{
            databaseActivationHash = await UserActivationLinkModel.findOne({activationHash: requestedActivationHash})

            if(databaseActivationHash){
                return await UserModel.findById(databaseActivationHash.userId);
            }

            return false;
        })

        if(!userToActivate){
            res.status(400);
            res.json({"error": "Invalid activation hash"});
            return;
        }

        userToActivate.activated = true;

        await UserController.attemptExecution(async()=>{
            await UserActivationLinkModel.deleteOne({_id: databaseActivationHash._id});
            await userToActivate.save();
            res.status(200);
            res.json({message: "Successfully activated account"});
            return;
        })
    }
    static async authenticateUser (req, res) {
        let {email, password} = req.body;

        //All database interactions are wrapped in a try catch block (attemptExecution)
        let user = await UserController.attemptExecution(async()=>{
            return await UserModel.findOne({email});
        })

        if(!user){
            res.status(401);
            res.json({error: "No user with that email exists"});
            return;
        }

        if(!user.activated){
            res.status(401);
            res.json({error: "You must confirm your email first"});
            return;
        }

        let passwordIsCorrect = await bcrypt.compare(password, user.password);

        if(!passwordIsCorrect){
            res.status(401);
            res.json({error: "Incorrect password"});
            return;
        }

        //If authentication runs into no errors
        let returnToken = JWT.sign({user_id: user._id, username}, process.env.TOKEN_KEY, {expiresIn: "1h"});
        res.status(200);
        res.json({message: "Successfully authenticated user", body: returnToken});
    }
    static async mustBeLoggedIn (req, res) {
        res.json({"message" : "You passed the authorization check!"});
    } 
}

module.exports = UserController;
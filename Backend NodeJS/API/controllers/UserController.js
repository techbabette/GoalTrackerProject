let UserModel = require("../models/User.js");
let BaseController =  require("./BaseController.js");

let bcrypt = require("bcryptjs");

const JWT = require("jsonwebtoken");

class UserController extends BaseController  {
    static async getGreeting (req, res) {
        res.send("Hello user");
    }
    static async createUser (req, res){
        let {username, password, repeatPassword, email} = req.body;

        //Data validation

        if(password != repeatPassword){
            res.status(400);
            res.json({error: "Passwords must match"});
            return;
        }

        //All database interactions are wrapped in a try catch block (attemptExecution)
        let existingUser = await UserController.attemptExecution(async()=>{
            return await UserModel.findOne({username});
        })

        if(existingUser){
            res.status(409);
            res.json({error : "User with this username already exists"});
            return;
        }

        password = await bcrypt.hash(password, 10);

        //Creating a new user if all data checks pass, attemptExecution wraps the function in a try catch block
        UserController.attemptExecution(async()=>{
            await UserModel.create({username, password, email});
            res.status(201);
            res.json({message: "Successfully created user"});
        })
    }
    static async authenticateUser (req, res) {
        let {username, password} = req.body;

        //All database interactions are wrapped in a try catch block (attemptExecution)
        let user = await UserController.attemptExecution(async()=>{
            return await UserModel.findOne({username});
        })

        if(!user){
            res.status(401);
            res.json({error: "No user with that username exists"});
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
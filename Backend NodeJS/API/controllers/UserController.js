let UserModel = require("../models/User.js");

let bcrypt = require("bcryptjs");

const JWT = require("jsonwebtoken");

module.exports = {
    getGreeting: (req, res) => {
        res.send("Hello user");
    },
    createUser: async (req, res) => {
        let {username, password, repeatPassword, email} = req.body;

        //Data validation

        if(password != repeatPassword){
            res.status(400);
            res.json({error: "Passwords must match"});
            return;
        }

        let existingUser = await UserModel.findOne({username});

        if(existingUser){
            res.status(409);
            res.json({error : "User with this username already exists"});
            return;
        }

        password = await bcrypt.hash(password, 10);

        //Creating a new user if all data checks pass (Currently unsafe, unsalted and unhashed, use only in dev)
        try{
            await UserModel.create({username, password, email});
            res.status(201);
            res.json({message: "Successfully created user"});
        }
        catch(e){
            res.status(500);
            res.json({error: "Unknown server error"});
        }
    },
    authenticateUser: async (req, res) => {
        let {username, password} = req.body;

        let user = await UserModel.findOne({username: username});

        if(!user){
            res.status(401);
            res.json({error: "No user with that username exists"});
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
}
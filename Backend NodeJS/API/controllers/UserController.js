let UserModel = require("../models/User.js");

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

        if(user.password !== password){
            res.status(401);
            res.json({error: "Incorrect password"});
            return;
        }

        res.status(200);
        res.json({message: "Successfully authenticated user"});
    }
}
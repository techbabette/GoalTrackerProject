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
    }
}
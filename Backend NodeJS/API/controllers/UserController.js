let BaseController =  require("./BaseController.js");
let UserService = require("../services/UserService.js");
let EmailService = require("../services/EmailService.js");
let UserData = require("../data/UserData.js");
let UserActivationLinkData = require("../data/UserActivationLinkData.js");

class UserController extends BaseController  {
    static async getGreeting (req, res) {
        res.send("Hello user");
    }
    static async createUser (req, res){
        try{
            //First see if user request is valid and can create user
            let result = await UserService.createUser(req.body);
    
            if(!result.success){
                res.status(401);
                res.json(result)
                return;
            }
    
            //If the checks pass, create a new user in the database
            let newUser = await UserData.createUser(req.body);
            let activationHash = await UserActivationLinkData.createActivationHash(newUser._id);
    
            //Send an activation email, potentially send email after res so user experience is smoother
            await EmailService.sendActivationEmail(activationHash, newUser.email, newUser.username);
    
            res.status(200);
            res.json(result);
        }
        catch{
            res.status(500)
            res.json(UserController.serverError);
            return;
        }
    }
    static async activateUser(req, res){
        try{
            let requestedActivationHash = req.params.activationHash;

            //Check if activation hash is correct and valid
            let result = await UserService.activateUser(requestedActivationHash);
    
            if(!result.success){
                res.status(401);
                res.json(result)
                return;
            }

            let userToActivate = result.body;

            //Activate user if activation hash is valid
            await UserData.activateUser(userToActivate);
            await UserActivationLinkData.deleteActivationHash(userToActivate._id);
    
            res.status(200);
            res.json(result);
        }
        catch{
            res.status(500)
            res.json(UserController.serverError);
            return;
        }
    }
    static async authenticateUser (req, res) {
        try{
            //Check if login credentials are correct
            let result = await UserService.authenticateUser(req.body);
    
            if(!result.success){
                res.status(401);
                res.json(result)
                return;
            }

            let user = result.body;

            //Create a token to return to client
            result.body = UserService.createToken({userId : user._id, username:user.username});
    
            res.status(200);
            res.json(result);
        }
        catch{
            res.status(500)
            res.json(UserController.serverError);
            return;
        }
    }
    static async getUserInformation(req, res){
        let userId = UserController.getUserIdFromToken(req);
        //Attempt to find user with id
        let user = await UserData.findUserById(userId);

        if(!user){
            res.status(401);
            res.json({message: "User not found", success: false});
            return;
        }

        res.status(200);
        res.json({message:"Found user", success: true, body:{username : user.username}});
        return;
    }
    static async startPasswordReset(req, res){
        try{
            //First see if user with given email exists exists
            let result = await UserData.findUser({email: req.body.email}); 

            if(!result){
                res.status(401);
                res.json({message: "User not found", success: false})
                return;
            }

            let user = result;

            //If the checks pass, create a new user in the database
            let activationHash = await UserActivationLinkData.createPasswordResetHash(user._id);

            //Send a password reset email
            await EmailService.sendActivationEmail(activationHash, newUser.email, newUser.username);

            res.status(200);
            res.json(result);
        }
        catch{
            res.status(500)
            res.json(UserController.serverError);
            return;
        }
    }
    static async submitPasswordReset(req, res){
        try{
            let requestedResetHash = req.params.passwordHash;
            let attemptedPassword = req.body.password;
            //Checks if the sent hash is correct and password is valid
            let result = await UserService.resetPassword(requestedResetHash, attemptedPassword);

            if(!result){
                res.status(401);
                res.json({message: result.message, success: false});
            }

            let user = result.body;

            user = await UserData.changeUserPassword(user, attemptedPassword);

            res.status(200);
            res.json({messsage:"Successfully changed password", success: true});
            return;
        }
        catch{
            res.status(500)
            res.json(UserController.serverError);
            return;
        }
    }
    static async mustBeLoggedIn (req, res) {
        res.json({"message" : "You passed the authorization check!"});
    } 
}

module.exports = UserController;
let UserModel = require("../models/User.js");
let UserActivationLinkModel = require("../models/UserActivationLink.js");
let BaseController =  require("./BaseController.js");
let NodeMailer = require("nodemailer");

let bcrypt = require("bcryptjs");
let crypto = require("crypto");

const JWT = require("jsonwebtoken");

let UserService = require("../services/UserService.js");

class UserController extends BaseController  {
    static async getGreeting (req, res) {
        res.send("Hello user");
    }
    static async createUser (req, res){
        let result = await BaseController.attemptExecution(()=>UserService.createUser(req.body));

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(401);
            res.json(result)
            return;
        }

        res.status(200);
        res.json(result);
    }
    static async activateUser(req, res){
        let requestedActivationHash = req.params.activationHash;

        let result = await BaseController.attemptExecution(()=>UserService.activateUser(requestedActivationHash));

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(401);
            res.json(result)
            return;
        }

        res.status(200);
        res.json(result);
    }
    static async authenticateUser (req, res) {
        let result = await BaseController.attemptExecution(()=>UserService.authenticateUser(req.body));

        if(result.serverError){
            res.status(500)
            res.json(result);
            return;
        }

        if(!result.success){
            res.status(401);
            res.json(result)
            return;
        }

        res.status(200);
        res.json(result);
    }
    static async mustBeLoggedIn (req, res) {
        res.json({"message" : "You passed the authorization check!"});
    } 
}

module.exports = UserController;
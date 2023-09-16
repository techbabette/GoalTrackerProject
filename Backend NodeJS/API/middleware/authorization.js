const JWT = require("jsonwebtoken");

let authorizationMethods = {
    amILoggedIn : (req, res, next) => {
        let tokenSent = req.headers["bearer"];
    
        if(!tokenSent){
            res.status(401);
            res.json({error: "You must be logged in to perform this action"});
            return;
        }
    
        try{
            JWT.verify(tokenSent, process.env.TOKEN_KEY);
        }
        catch(e){
            res.status(401)
            res.json({error: "Session expired", success: false});
            return;
        }
    
        return next();
    },
    
    //Unused per-permission check, for potential per-permission access limits
    doIHaveThisPermission : (permission) => {
        return (req, res, next) => {
            //Find user and user permissions, check if user has specified permission, if not, throw error
            return next();
        }
    },

    //Unused access level check, for potential level based access limits
    doIHaveThisAccessLevel : (level) => {
        return (req, res, next) => {
            //Find user and user level, check if user level is equal to or greater than level required
            return next();
        }
    }
}


module.exports = authorizationMethods;
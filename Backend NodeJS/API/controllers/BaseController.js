class baseController{
    static getUserIdFromToken(req){
        let tokenSent = req.headers["bearer"];
    
        let userId = JSON.parse(Buffer.from(tokenSent.split('.')[1], 'base64').toString()).user_id; 
    
        return userId;
    }
    //Simple operation manager alternative
    static attemptExecution(functionToExecute){
        try{
            return functionToExecute();
        }
        catch(ex){
            res.status(500);
            res.json({error: "Unknown server error"});
        }
    } 
}

module.exports = baseController
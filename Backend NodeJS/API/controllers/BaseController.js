class baseController{
    static getUserIdFromToken(req){
        let tokenSent = req.headers["bearer"];
    
        let userId = JSON.parse(Buffer.from(tokenSent.split('.')[1], 'base64').toString()).user_id; 
    
        return userId;
    }
    //Simple operation manager alternative
    //Placeholder res object during service transition
    static attemptExecution(functionToExecute, res = {}){
        try{
            return functionToExecute();
        }
        catch(ex){
            console.log(ex);
            res.status(500);
            res.json({error: "Unknown server error"});
        }
    } 
}

module.exports = baseController
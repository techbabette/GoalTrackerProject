class baseController{
    static getUserIdFromToken(req){
        let tokenSent = req.headers["bearer"];
    
        let userId = JSON.parse(Buffer.from(tokenSent.split('.')[1], 'base64').toString()).user_id; 
    
        return userId;
    }
    //Simple operation manager alternative
    //Placeholder res object during service transition
    static async attemptExecution(functionToExecute, res = {}){
        try{
            return await functionToExecute();
        }
        catch(ex){
            return {message: "Server error", success : false, serverError : true};
        }
    } 
}

module.exports = baseController
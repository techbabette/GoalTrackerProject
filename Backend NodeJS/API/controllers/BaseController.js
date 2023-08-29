class baseController{
    static getUserIdFromToken(req){
        let tokenSent = req.headers["bearer"];
    
        let userId = JSON.parse(Buffer.from(tokenSent.split('.')[1], 'base64').toString()).user_id; 
    
        return userId;
    }
    static serverError = {message: "Server error", success : false, serverError : true};
    //Simple operation manager alternative
    //Placeholder res object during service transition
    static async attemptExecution(functionToExecute){
        try{
            return await functionToExecute();
        }
        catch(ex){
            console.log(ex);
            return this.serverError;
        }
    }
}

module.exports = baseController
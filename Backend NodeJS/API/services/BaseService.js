class baseService{
    //Simple operation manager alternative
    static attemptExecution(functionToExecute){
        try{
            return functionToExecute();
        }
        catch(ex){
            return {success: false, message: "Unknown server error"};
        }
    } 
}

module.exports = baseService
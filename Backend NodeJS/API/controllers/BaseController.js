class baseController{
    static getUserIdFromToken(req){
        let tokenSent = req.headers["bearer"];
    
        let userId = JSON.parse(Buffer.from(tokenSent.split('.')[1], 'base64').toString()).user_id; 
    
        return userId;
    }
}

module.exports = baseController
async function tryNext(req, res, next){
    try{
        await next();
    }
    catch(error){
        res.json({message: "Server error", success : false, serverError : true});
    }
}

module.exports = tryNext;
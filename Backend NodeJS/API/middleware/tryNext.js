function handleError (res){
    console.log("Error handling called");
    res.json({message: "Server error", success : false, serverError : true});
}


function tryNext (req, res, next) {
    return Promise
        .resolve(next(req, res))
        .catch(handleError(res));
};

module.exports = tryNext;